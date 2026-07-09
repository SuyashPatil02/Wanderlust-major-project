const REQUIRED_ENV_VARS = ["SECRET"];

if (process.env.NODE_ENV === "production") {
    REQUIRED_ENV_VARS.push("ATLASDB_URI", "CLOUD_NAME", "CLOUD_API_KEY", "CLOUD_API_SECRET");
}

for (const variable of REQUIRED_ENV_VARS) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

module.exports = {
    port: Number(process.env.PORT) || 8080,
    nodeEnv: process.env.NODE_ENV || "development",
    dbUrl: process.env.NODE_ENV === "production"
        ? process.env.ATLASDB_URI
        : process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wanderlust",
    sessionSecret: process.env.SECRET,
    mapToken: process.env.MAP_TOKEN || "",
};
