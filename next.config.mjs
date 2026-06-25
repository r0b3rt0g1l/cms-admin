/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite revisar el panel por LAN (celular) en dev sin que Next bloquee el JS.
  allowedDevOrigins: ['192.168.0.119', '192.168.0.146'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;