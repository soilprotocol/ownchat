import sparql from "sparql-fiddle";
  
function rankFriendsOfFriends(entity) {    
  return new Promise((resolve, reject) => {
    const query = "PREFIX n: <http://xmlns.com/foaf/0.1/> SELECT ?o WHERE {?s n:knows ?o.}";
    let friendsOfFriends = [];
    let myFriends = [];
    runQuery(entity, query).then((results) => {
      const fofPromises = results.map((friend) => {
        myFriends.push(friend.o);
        return runQuery(friend.o, query);
      });
      Promise.all(fofPromises).then(res => {
        res.forEach(friends => {
          friends.forEach(friend => {
            friendsOfFriends.push(friend.o);
          });
        });
        return friendsOfFriends;
      }).then(friends => {
        return removeFriendsInCommon(friends, myFriends);
      }).then(friends => {
        resolve(rankFriends(friends));
      });
    });
  });
};

function removeFriendsInCommon(friendsOfFriends, myFriends) {
  return friendsOfFriends.filter(friend => {
    return myFriends.indexOf(friend) == -1 ? true : false;
  });
};

function rankFriends(friendsOfFriendArray) {
  let counts = {};
  friendsOfFriendArray.forEach(friend => {
    counts[friend] = (counts[friend] || 1) + 1;
  });
  let sortable = [];
  for (let friend in counts) {
    sortable.push([friend, counts[friend]]);
  }
  let rankedFriendsList = sortable
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, cur) => {
      acc.push(cur[0]);
      return acc;
    }, []);
  return rankedFriendsList;
};

function runQuery(endpoint, query) {
  const fiddle = {
    data: endpoint,
    query: query,
    wanted: "Array"
  };
  return sparql.run(fiddle);
};

export {rankFriendsOfFriends};

//how to return a value from a promise => you don't, you return the promise itself. 