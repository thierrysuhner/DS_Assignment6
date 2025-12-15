# Distributed Knowledge Graphs


## Project Structure

```bash
Task 3 #A node project to implement a HTTP server for Task 3
└── app.js # The server code (TODO: complete)
└── index.html #The Web page
└── package.json #A JSON file used by Node to provide information about the project and how to run it.
query_group.rq #A SPARQL query used in Task 2. TODO: complete
query_friends.rq #A SPARQL query used in Task 2. TODO: complete
Report.md #The Report (TODO: complete)
README.md #This README.
```



## Task 1: Your Personal Solid Pod (1pt)

Go to https://wiser-solid-xi.interactions.ics.unisg.ch/.account/login/password/register/ and create a Solid Pod for each group member.

Use a Pod editor, such as [`Penny`](https://penny.vincenttunru.com) to edit your Pod. Your Pod provider is https://wiser-solid-xi.interactions.ics.unisg.ch/.

WARNING: If you edit your WebID profile with a file that is not a proper Turtle document, you will lose access to your Pod. You can use a Turtle editor (e.g., https://felixlohmeier.github.io/turtle-web-editor/) to edit your profile and ensure that it satisfies the right Turtle syntax. You MUST NOT remove any information created by the Solid provider (e.g., solid:oidcIssuer) as this information is required for connecting an app to the Solid pod. Keep each working version of the WebId profile. If your profile is no longer valid and you cannot connect to your pod, contact Jérémy (jeremy.lemee@unisg.ch) so that he can reinitialize your working profile. Otherwise, the reinitialization will be done with default values. 

One group member creates in their Pod a Turtle page to represent the group and indicates the group members using the FOAF ontology.

You need to set the permissions for the group profile:

1) use the Penny application to create the Access Control List (ACL) file for the created group profile. The ACL created by default gives full permission for the owner to read and write to the profile but no permission for everyone else.

2) In the ACL file for the group profile, add a new Thing and convert it to an Access Control. Now, you can set the read permission on this new Thing for everyone but no write permission.

Example of such a group: https://wiser-solid-xi.interactions.ics.unisg.ch/jlemee/bcs-ds-2025-ta-group

The group members updates their WebId profiles to indicate their name, mail box, and group they belong to.

Example of such a profile: https://wiser-solid-xi.interactions.ics.unisg.ch/jlemee/profile/card#me

These different profiles should be added to your submission and linked in the Report.

You can read a description of the FOAF ontology [`here`:](https://sparontologies.github.io/foaf/current/foaf.html) and a formal representation in Turtle [`here`](https://raw.githubusercontent.com/SPAROntologies/foaf/refs/heads/master/docs/current/foaf.ttl)

Use a Linked Data browser plugin, such as [`this one`](https://chromewebstore.google.com/detail/openlink-structured-data/egdaiaihbdoiibopledjahjaihbmjhdj) (for Chrome and other Chromium-based browsers) or [`this one`](https://addons.mozilla.org/en-US/firefox/addon/rdf-browser/) for Firefox, to navigate the distributed social graph.


## Task 2: Query the distributed social graph (1.5pt)

First, if you do not have npm, you have to install it. Information on how to this are available here: https://nodejs.org/en/download/package-manager

Install Comunica with:

```bash
npm install -g @comunica/query-sparql
```

1. Perform a comunica-sparql query to get your group from your WebId. Put your query in the file [`query_group.rq`](query_group.rq).

You can perform the request with:
```bash
comunica-sparql https://wiser-solid-xi.interactions.ics.unisg.ch/tsuhner/profile/card#me -f query_group.rq
```


Install Comunica for Link Traversal with:

```bash
npm install -g @comunica/query-sparql-link-traversal
```

2. Perform a comunica-sparql-link-traversal query to get your social graph (friends and friends of friends recursively) from your WebId. Put your query in a in the file [`query_friends.rq`](query_friends.rq).Compare with the result of the request performed without link traversal. Note: You can use the syntax: subject (predicate)+ object in your SPARQL query to follow the discovered links.

You can perform the request using link traversal with:
```bash
comunica-sparql-link-traversal https://wiser-solid-xi.interactions.ics.unisg.ch/tsuhner/profile/card#me -f query_friends.rq -l debug
```
and without link traversal with:
```bash
comunica-sparql https://wiser-solid-xi.interactions.ics.unisg.ch/tsuhner/profile/card#me -f query_friends.rq -l debug
```


# Task 3: A Solid-Based Application (1.5pt)

In this task, you will use the application [`MediaKraken`](https://noeldemartin.github.io/media-kraken/) to add movies to your Solid Pod.

First, you need to perform some steps: 
1) Ensure that there is no movies/ container in your pod. Delete it if there is already one (or containers with movies in the name). This container will be created by MediaKraken.
2) Create in your pod a container named settings/ (the slash is important)
3) In the settings/ container, add an empty file called privateTypeIndex
4) Add the link to that privateTypeIndex in your WebId profile: 

<#me> solid:privateTypeIndex <path_to_privateTypeIndex>.

5) In your WebId profile, add a reference to your pod URL:
- In the prefixes at the top, add:

@prefix pim: <http://www.w3.org/ns/pim/space#> . 

- Then, add in your profile:

<#me> pim:storage <path_to_pod_url>.


For an example, you can have a look at my profile: https://wiser-solid-xi.interactions.ics.unisg.ch/jlemee/profile/card#me. 

If at some point, you encounter any issue when connecting to [`MediaKraken`](https://noeldemartin.github.io/media-kraken/), ensure that the previous conditions are satisfied.


Then, you can connect to [`MediaKraken`](https://noeldemartin.github.io/media-kraken/) using your WebId and your Solid credentials to add movies to the Solid Pod of at least one member of your group. After that, the movies are included as files in the movies container in the pod but the movies folder is not public. To do so:

1) use the Penny application to create the Access Control List (ACL) file for the created movies container. The ACL created by default gives full permission for the owner to read and write to the container and its contained resources but no permission for everyone else.

2) In the ACL file for the movies container, add a new Thing and convert it to an ACL. Now, you can set the read permission on this new Thing, for everyone for the resource and contained resources but no write permission.

Look at https://wiser-solid-xi.interactions.ics.unisg.ch/jlemee/movies/ for an example of such a created container. The content of the container should be visible even to users which are not logged in to your Solid account. 

Then, you need to provide a link in your profile to the created movies container. This is done by adding a triple:
<#me> <https://example.org/hasMovieContainer> <path_to_movies_container>. 

See an example, on my profile: https://wiser-solid-xi.interactions.ics.unisg.ch/jlemee/profile/card#me. 

Now, you can complete the provided JavaScript project template [`app.js`](Task%203/app.js), and potentially [`index.html`](Task%203/index.html), for creating a Node Web application, using the Comunica framework (https://comunica.dev/docs/query/getting_started/query_app/). The application can perform 2 operations:
1) Showing the names and images for all movies contained in one movies container. On the application, you provide the URL of the movies container and use the button "Submit". You can complete this feature by implementing the SPARQL queries in the function handle_query in [`app.js`](Task%203/app.js)

2) Showing the names and images for all movies that are in the movies container for the members of the group. On the application, you provide the URL of the group profile (e.g., https://wiser-solid-xi.interactions.ics.unisg.ch/jlemee/bcs-ds-2025-ta-group) and use the button "Submit Group". You can complete this feature by implementing the SPARQL queries in the function handle_query_group in [`app.js`](Task%203/app.js)

Note: You can also modified [`index.html`](Task%203/index.html) but this is not required to complete the Task. 

You can use the command ```npm i``` to load the node modules from the Task 3 folder.

You can then use the command ```npm start``` to start the application. Then, go to http://localhost:5000 to see the Web page.

Note: We recommend you to write to test your application on Google Chrome for having the most consistent results in displaying the movies. You can also change the port from 5000 to another port if the port 5000 is already taken on your machine. 

# Task 4: A Solid-Based Application (1pt)

Answer the questions in the [`Report`](Report.md)
