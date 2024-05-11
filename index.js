"use strict"; // used to avoid duplicate global variable & throwing more exceptions

const Hapi = require("hapi");
const path = require("path"); // path provides utilites for working with file and dir paths

const init = async () => {
  // asyn always return promises and can use await only inside it

  //Initialize server
  const server = Hapi.Server({
    host: "localhost",
    port: 5000,
    /* routes: {
      files: {
        relativeTo: path.join(__dirname, "static"),
      },
    },*/
  });

  //register plugin
  await server.register([
    {
      plugin: require("hapi-geo-locate"),
      option: { enabledByDefault: false },
    },
    {
      plugin: require("inert"),
    },
  ]);

  //Home router
  server.route([
    {
      method: "GET",
      path: "/",
      handler: (request, h) => {
        return "<h1>Hello World</h1>";
      },
    },
    {
      method: "GET",
      path: "/users",
      handler: (request, h) => {
        return "<h1>Hello User</h1>";
      },
    },
    {
      method: "GET",
      path: "/location",
      handler: (request, h) => {
        if (request.location) {
          return request.location;
        } else {
          return "<h1> Ohh! Your location is disabled</h1>";
        }
      },
    },
    {
      method: "GET",
      path: "/about",
      handler: (request, h) => {
        return h.file("./static/about.html");
        // return h.file("about.html");
      },
    },

    {
      method: "GET",
      path: "/user/{name?}",
      handler: (request, h) => {
        return `<h1>Hello ${request.query.name}</h1>`;
      },
    },
    {
      method: "GET",
      path: "/{any*}", // can use the path without name params since we gave ?
      handler: (request, h) => {
        return "<h1> Oh No! You must be Lost</h1>";
      },
    },
    {
      method: "POST",
      path: "/login",
      handler: (request, h) => {
        console.log(request.payload.username);
        console.log(request.payload.password);
        return "Hi";
      },
    },
  ]);

  /*server.route({
    method:'GET',
    path:'/user/{names?}',
    handler:(request,h)=>{
        return `<h1>Hello ${request.params.names}</h1>`;
    } 
})

server.route({
     method:'GET',
     path:'/users/{name?}',  // can use the path without name params since we gave ?
     handler:(request,h)=>{
        if (request.params.name){
            return `<h1>Hello ${request.params.name}</h1>`;
        }
        else{
            return "<h1> Hello User! </h1>";
        }
       
     }
 }) 
*/
  await server.start();
  console.log(`This is console of server ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  // when promise is rejected and no error handler is available then occurs unhandledRejection
  console.log(err);
  process.exit(1); // used to exit the process 1 and process terminated bcz of err . 0 means process terminated successfully without any error
});
init();
