const pm2 = require("pm2");

const instances = process.env.WEB_CONCURRENCY || 1;
const maxMemory = process.env.WEB_MEMORY || 20480;

pm2.connect(function() {
  pm2.start(
    {
      script: "dist/index.js",
      name: "kitecolo-back",
      exec_mode: "cluster",
      instances: instances,
      max_memory_restart: maxMemory + "M",
      env: {
        NODE_ENV: "production"
      }
    },
    function(err) {
      if (err)
        return console.error(
          "Error while launching applications",
          err.stack || err
        );
      console.log("PM2 and application has been succesfully started");

      pm2.launchBus(function(err, bus) {
        console.log("[PM2] Log streaming started");

        bus.on("log:out", function(packet) {
          console.log("[App:%s] %s", packet.process.name, packet.data);
        });

        bus.on("log:err", function(packet) {
          console.error("[App:%s][Err] %s", packet.process.name, packet.data);
        });
      });
    }
  );
});
