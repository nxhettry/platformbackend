// next.config.mjs
export default {
  async rewrites() {
    return [
      {
        source: "/api/socketio",
        destination: "/api/socket",
      },
    ];
  },
};
