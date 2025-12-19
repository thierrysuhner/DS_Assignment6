const express = require("express");
const cors = require('cors');
const app = express();
const http = require('http');
const path = require('path');
const httpServer = http.Server(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);

const QueryEngine = require('@comunica/query-sparql').QueryEngine;

const engine = new QueryEngine();

const port = 5001;

app.use(cors())

app.use(express.json())

app.use(express.static('public'))



app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/movies', (req, res) => {
  let input_url = req.query.url
  console.log("input url: ", input_url)
  res.statusCode = 200
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, 'index.html'));
  if (!input_url) {
    return;
  }
  setTimeout(() => {
    handle_query(input_url);
  }, 2000);
});

app.get('/movies_group', (req, res) => {
  let input_url = req.query.url
  console.log("input url: ", input_url)
  res.statusCode = 200
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, 'index.html'));
  if (!input_url) {
    return;
  }
  setTimeout(() => {
    handle_query_group(input_url);
  }, 2000);
});

async function handle_query(input_url){
  let movie_urls=[]
  try {
    const bindingsStream = await engine.queryBindings(`
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?v WHERE {
                   <${input_url}> ldp:contains ?v .
    } `, {
      sources: [input_url],
    }); // SPARQL query to get the URLs of the pages describing the movies from the container
    bindingsStream.on('data', (data) => {
      movie_urls.push(data.get('v').value);
    });
    bindingsStream.on('error', (err) => {
      console.error('An error occured:', err);
      return;
    });
    bindingsStream.on('end', async () => {
      if (movie_urls.length === 0) {
        console.log('[/movies] no movies found in this container');
        return;
      }
      engine.queryBindings(`
              PREFIX schema: <https://schema.org/>
              SELECT ?name ?image WHERE {
                ?movie schema:name ?name ;
                       schema:image ?image .
              }
    `, { sources: movie_urls, // SPARQL query to get the name and the URL for the image a page describing a movie on the pod.
      }).then(function (moviesStream) {
        moviesStream.on('data', function (data) {
          let obj = {
            "name": data.get('name').value,
            "image": data.get('image').value
          };
          console.log('emitting /movies movie', obj);
          io.emit('update', {'message': obj}) //Send information to the browser.
        });
        moviesStream.on('error', (err) => {
          console.error('[/movies] movies stream error:', err);
          return;
        });
      }).catch((err) => {
        console.error('[/movies] queryBindings (movie details) failed:', err);
      });
    });
  }
  catch (err) {
    console.error('[/movies] queryBindings (container) failed:', err);
    return;
  }
}

async function handle_query_group(input_url) {
  console.log("input url: ", input_url);
  let member_urls = [];
  let movie_containers = [];
  let movie_urls = [];

  engine.queryBindings(`
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      SELECT ?m WHERE {
        ?group <http://xmlns.com/foaf/0.1/member> ?m .
  }`, { //SPARQL query to get the members of a group from a group profile.
    sources: [input_url],
  }).then(function (bindingsStream) {

    bindingsStream.on('data', function (data) {
      console.log("value find: ", data.get('m').value);
      member_urls.push(data.get('m').value);
    });

    bindingsStream.on('error', (err) => {
      console.error('[/movies_group] member stream error:', err);
      return;
    });

    bindingsStream.on('end', function () {
      if (member_urls.length === 0) {
        console.log('[/movies_group] no members found');
        return;
      }

      console.log("group members urls: ", member_urls);


      engine.queryBindings(`
            PREFIX ex: <https://example.org/>
            SELECT ?movieContainer WHERE {
            ?member ex:hasMovieContainer ?movieContainer .
      }`, { // SPARQL query to get the movie container from a profile.
        sources: member_urls,
      }).then(function (memberStream) {

        memberStream.on('data', function (data) {
          console.log("value find: ", data.get('movieContainer').value);
          movie_containers.push(data.get('movieContainer').value);
        });

        memberStream.on('error', (err) => {
          console.error('[/movies_group] movieContainer stream error:', err);
          return;
        });

        memberStream.on('end', function () {
          if (movie_containers.length === 0) {
            return;
          }

          console.log("movie containers: ", movie_containers);


          engine.queryBindings(`
                        PREFIX ldp: <http://www.w3.org/ns/ldp#>
                        SELECT ?v WHERE {
                          ?container ldp:contains ?v .                        
                        }
          `, { // SPARQL query to get the URLs of the pages describing the movies from the container
            sources: movie_containers,
          }).then(function (containerStream) {

            containerStream.on('data', function (data) {
              movie_urls.push(data.get('v').value);
            });

            containerStream.on('error', (err) => {
              console.error('[/movies_group] container stream error:', err);
              return;
            });

            containerStream.on('end', function () {
              if (movie_urls.length === 0) {
                return;
              }

              engine.queryBindings(`
                           PREFIX schema: <https://schema.org/>
                           SELECT ?name ?image WHERE {
                                                ?movie schema:name ?name ;
                                                schema:image ?image .
                  }
                `, { // SPARQL query to get the name and the URL for the image a page describing a movie on the pod.
                sources: movie_urls,
              }).then(function (movieStream) {

                movieStream.on('data', function (data) {
                  let obj = {
                    "name": data.get('name').value,
                    "image": data.get('image').value
                  };
                  io.emit('update', { 'message': obj }); //Send information to the browser.
                });

                movieStream.on('error', (err) => {
                  console.error('[/movies_group] final movie stream error:', err);
                  return;
                });

              }).catch((err) => {
                console.error('[/movies_group] queryBindings (final movie details) failed:', err);
              });
            });

          }).catch((err) => {
            console.error('[/movies_group] queryBindings (container -> movies) failed:', err);
          });
        });

      }).catch((err) => {
        console.error('[/movies_group] queryBindings (movieContainer) failed:', err);
      });
    });

  }).catch((err) => {
    console.error('[/movies_group] queryBindings (members) failed:', err);
  });
}





httpServer.listen(port, () => {
  console.log("Server is running... on " + port);
});