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
* Thierry Suhner: https://wiser-solid-xi.interactions.ics.unisg.ch/tsuhner/profile/card#me
* Karla Ruggaber: https://wiser-solid-xi.interactions.ics.unisg.ch/kruggaber/profile/card#me

2. Indicate the URL of group profile and the file that contains the group profile.

Ans:
* URL: https://wiser-solid-xi.interactions.ics.unisg.ch/tsuhner/bcs-ds-2025-group-11
* File: [group_profile.ttl](profiles/group_profile.ttl)


# Task 2

1. Create a SPARQL query to retrieve the URI of the group to which you belong from your FOAF profile. Provide the query in the [`query_group.rq`](query_group.rq) file. 


2. Query the names of all the people in your distributed social graph (i.e., people you know directly or indirectly) using your profile as an entry point. To do this, you will need to write a navigational query (see lecture slides) and use link traversal (using the command comunica-sparql-link-traversal). Try running the query without link traversal as well and see what happens. Provide the query in the [`query_friends.rq`](query_friends.rq) file (see project README) and explain the results.

Ans:
* Response of our query WITH link traversal:
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


* Response of our query WITHOUT link traversal:
[
]

**Explanation of the results:** 
When executing the query WITH link traversal, Comuica starts from our own Solid profile and follows RDF links (foaf:knows) to other profiles. By dereferencing these linked profiles, it then discovers and queries data from multiple Pods (from all the linked friends), which results in a list of people we know both directly and indirectly.
When running the same query WITHOUT link traversal, the result is empty. This is because in this case, Comunica only evaluates the query over the initial profile document and doesn't follow any external links. Since the names of other people are stored in their own profile documents, no results can be found without traversal. So basically, without the link traversal, the query only finds the first link (-> the profile) and doesn't go further, where it would discover the names and so on.


# Task 4

1. Which rules of Linked Data are applied to create the distributed knowledge graphs used in this assignment? Provide one concrete example for each rule you identify.

Ans: 
* Rule 1: Use URIs to identify things: According to this rule, in linked data, every real-world entity must be identified using globally unique URIs, not local IDs or plain strings. This allows different knowledge graphs to refer to the same entity unambiguously. Some examples from the assignment are: the group identified by a specific URI (in our case: https://wiser-solid-xi.interactions.ics.unisg.ch/tsuhner/bcs-ds-2025-group-11), each person being identified by their own URI using #me (in our case e.g. https://wiser-solid-xi.interactions.ics.unisg.ch/kruggaber/profile/card#me)
* Rule 2: Use HHTP URIs so that these idnetifiers can be looked up: According to this rule, linked data requires URIs to be HTTP URIs, meaning they can be dereferenced. When a client accesses such a URI, it can retrieve a description of the resource. Some examples from the assignment are: The URI https://wiser-solid-xi.interactions.ics.unisg.ch/tsuhner/profile/card identifies a FOAF profile document (rdf:type foaf:PersonalProfileDocument), thus identifiers in our knowledge graph are HTTP-based and can be looked up (e.g. by SPARQL-Queries)
* Rule 3: Provide useful information using standard formats: According to this rule, when a URI is dereferenced, it should return machine-readable data using Web standards (such as RDF and well-known vocabularies). This ensure interoperability between distributed knowledge graphs. Some examples from the assignment are that Persons are being described using FOAF (:me rdf:type foaf:Person; foaf:name "Thierry Suhner"; foaf:mbox <mailto:thierry.suhner@student.unisg.ch>.) and group membership is expressed using standard RDF triples (rdf:type foaf:Group; foaf:member <.../tsuhner/profile/card#me, <.../kruggaber/profile/card#me>.), so all information is expressed in RDF/Turtle and uses shared vocabularies.
* Rule 4: Include links to other URIs to enable discovery: According to this last rule, a key principle of Linked Data is that resources should link to other resources, allowing data to be discovered, followed and integrated across distributed knowledge graphs. Some examples from the assignment are that the group profile links to its members (foaf:member <.../tsuhner/profile/card#me>, <../kruggaber/profile/card#me>.) and individual profiles link to other people using foaf:knows (e.g. foaf:knows <https://wiser-solid-xi.interactions.ics.unisg.ch/Elia/profile/card#me> ;). These links connect separate profile documents into a distributed knowledge graph.



2. One of your colleagues states that a Solid pod in itself is represented as a knowledge graph. Do you agree with this statement? Explain briefly

Ans: We only partly agree, as a Solid pod contains multiple knowledge graphs, because its resources (e.g. profile docs, group profiles, containers, etc.) are represented in RDF and together form an interlinked set of graphs. However, a Solid pod is not itself a single knowledge graph, but rather a storage space that hosts many RDF resources, each of wich can be its own knowledge graph. Only when considering the union of all RDF resources in a pod can it be viewed as a knowledge graph.

3. One core idea behind Solid is to decouple applications from data. Explain in your own words what this means and what technical and societal implications you see.

Ans:  Decoupling applications from data in Solid means that applications no longer store or own user data themselves, but instead, users keep their data in their own Solid pods and grant applications permission to access it. This allows users to change or stop using an application without losing their data, since the data remains independent of any specific app. Technically, this leads to more interoperable systems where multiple applications can work on the same data using standard Web technologies (e.g. RDF/HTTP), while access control and identity management become central aspects of the architecture. It also results ina more distributed system design, where data is no longer centralized in a single backend. From a societal perspective, this approach strengthens user data sovereignty and privacy, reduces lock-in to certain vendors or platforms, and shifts control away from large platforms toward users which potentially enables fairer competition and more transparent data usage practices, as the platforms would need to provide more value than just having the highest amount of data and information about you and your knowledge, friends, etc.


