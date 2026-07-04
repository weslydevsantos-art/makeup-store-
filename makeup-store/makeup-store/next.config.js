/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Ajuste os domínios de onde as fotos de produto vão vir
    // (seu storage próprio, S3, Cloudinary, etc.)
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  }
};

module.exports = nextConfig;
