Assignment 6 Solution
---------------------

# Team Members

* Karla Ruggaber
* Thierry Suhner

# GitHub link to your (forked) repository

https://github.com/thierrysuhner/DS_Assignment6

# Task 1

1. Indicate WebIDs of the group members and the files corresponding to the profiles of the group members.

Ans:


2. Indicate the URL of group profile and the file that contains the group profile.

Ans:




# Task 2

1. Create a SPARQL query to retrieve the URI of the group to which you belong from your FOAF profile. Provide the query in the [`query_group.rq`](query_group.rq) file. 


2. Query the names of all the people in your distributed social graph (i.e., people you know directly or indirectly) using your profile as an entry point. To do this, you will need to write a navigational query (see lecture slides) and use link traversal (using the command comunica-sparql-link-traversal). Try running the query without link traversal as well and see what happens. Provide the query in the [`query_friends.rq`](query_friends.rq) file (see project README) and explain the results.

Ans:

[
{"name":"\"Karla Ruggaber\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/kruggaber/profile/card#me"},
{"name":"\"Elia Besmer\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/Elia/profile/card#me"},
{"name":"\"Leon Schwendener\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/ls/profile/card#me"},
{"name":"\"Jérémy Lemée\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/jlemee/profile/card#me"},
{"name":"\"Thierry Suhner\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/tsuhner/profile/card#me"},
{"name":"\"Colin Berendt\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/ColinsPod/profile/card#me"},
{"name":"\"Jeremy Lemee\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/jeremy/profile/card#me"},
{"name":"\"Jeremy Lemee's First Alter Ego\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/jeremy2/profile/card#me"},
{"name":"\"Jeremy Lemee's Second Alter Ego\"","person":"https://wiser-solid-xi.interactions.ics.unisg.ch/jeremy3/profile/card#me"}
]

[
]

Only find first link (-> the profile).


# Task 4

1. Which rules of Linked Data are applied to create the distributed knowledge graphs used in this assignment? Provide one concrete example for each rule you identify.

Ans:

2. One of your colleagues states that a Solid pod in itself is represented as a knowledge graph. Do you agree with this statement? Explain briefly

Ans:

3. One core idea behind Solid is to decouple applications from data. Explain in your own words what this means and what technical and societal implications you see.

Ans: 


