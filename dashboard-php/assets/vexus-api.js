(function () {
  var API_PREFIX = "/api/v1";
  var refreshPromise = null;

  function ApiError(message, options) {
    this.name = "ApiError";
    this.message = message;
    this.status = options && options.status ? options.status : 500;
    this.code = options && options.code ? options.code : "API_ERROR";
    this.details = options && options.details ? options.details : null;
  }
  ApiError.prototype = Object.create(Error.prototype);

  function toApiPath(path) {
    if (!path) {
      return API_PREFIX;
    }
    if (path.indexOf("http://") === 0 || path.indexOf("https://") === 0) {
      return path;
    }
    if (path.indexOf("/api/") === 0) {
      return path;
    }
    return API_PREFIX + (path.charAt(0) === "/" ? path : "/" + path);
  }

  async function safeJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async function refreshSession() {
    if (!refreshPromise) {
      refreshPromise = fetch(toApiPath("/auth/refresh"), {
        method: "POST",
        credentials: "include"
      })
        .then(function (response) { return response.ok; })
        .catch(function () { return false; })
        .finally(function () {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  }

  async function request(path, options, allowRetry) {
    var settings = options || {};
    var retry = allowRetry !== false;
    var headers = new Headers(settings.headers || {});
    var body = settings.body;

    if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    var response = await fetch(toApiPath(path), {
      method: settings.method || "GET",
      body: body,
      headers: headers,
      credentials: "include"
    });

    if (
      response.status === 401 &&
      retry &&
      String(path).indexOf("/auth/login") === -1 &&
      String(path).indexOf("/auth/refresh") === -1
    ) {
      var refreshed = await refreshSession();
      if (refreshed) {
        return request(path, options, false);
      }
    }

    var payload = await safeJson(response);

    if (!response.ok) {
      throw new ApiError(
        (payload && payload.error && payload.error.message) || "Request failed.",
        {
          code: payload && payload.error ? payload.error.code : "API_ERROR",
          details: payload && payload.error ? payload.error.details : null,
          status: response.status
        }
      );
    }

    if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
      return payload.data;
    }

    return payload;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDateTime(value) {
    if (!value) {
      return "n/a";
    }
    try {
      return new Date(value).toLocaleString("pt-BR");
    } catch (error) {
      return String(value);
    }
  }

  function formatRelativeTime(value) {
    if (!value) {
      return "n/a";
    }
    var date = new Date(value);
    var diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (Number.isNaN(diff)) {
      return "n/a";
    }
    if (diff < 60) {
      return "agora";
    }
    if (diff < 3600) {
      return Math.floor(diff / 60) + "m";
    }
    if (diff < 86400) {
      return Math.floor(diff / 3600) + "h";
    }
    return Math.floor(diff / 86400) + "d";
  }

  function setButtonBusy(button, text) {
    if (!button) {
      return function () {};
    }
    var original = button.dataset.originalText || button.textContent;
    button.dataset.originalText = original;
    button.disabled = true;
    button.textContent = text;
    return function () {
      button.disabled = false;
      button.textContent = original;
    };
  }

  window.VexusApi = {
    ApiError: ApiError,
    delete: function (path) { return request(path, { method: "DELETE" }); },
    escapeHtml: escapeHtml,
    formatDateTime: formatDateTime,
    formatRelativeTime: formatRelativeTime,
    get: function (path) { return request(path); },
    patch: function (path, data) { return request(path, { method: "PATCH", body: JSON.stringify(data || {}) }); },
    post: function (path, data) { return request(path, { method: "POST", body: JSON.stringify(data || {}) }); },
    request: request,
    setButtonBusy: setButtonBusy
  };
})();
