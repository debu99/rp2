const misc = require('../sMisc');

mp.events.addCommand({
    'getpos': (player) => {
        if (player.adminlvl < 1) return;
        const playerPos = player.position;
        player.outputChatBox("Current position: " + playerPos.toString());
    },

    'pos' : (player) => { 
        if (player.adminlvl < 1) return;
        const pos = player.position;
        let rot;
        if (player.vehicle) {
            rot = player.vehicle.rotation.z;
        } else {
            rot = player.heading;
        }
        const str = `x: ${misc.roundNum(pos.x, 3)}, y: ${misc.roundNum(pos.y, 3)}, z: ${misc.roundNum(pos.z, 3)}, rot: ${misc.roundNum(rot, 2)}`;
        player.outputChatBox(str);
        misc.log.debug(str);
    },
   
    'tp': (user, fullText, playerId) => {
        if (user.adminlvl < 1) return user.outputChatBox("对不起，您无权限使用 /tp");
        console.log('user.guid='+user.guid);
        console.log('playerId='+playerId);
        let playerOnlineID = misc.isNumber(playerId);
        if (!playerOnlineID && playerOnlineID!==0) return user.outputChatBox("/tp playerId");
        const player = mp.players.at(playerOnlineID);
        console.log(player);
        if (!player) return user.outputChatBox(`!{200, 0, 0}Player ${playerOnlineID} does not exist!`);
        console.log('player.guid='+player.guid);
        let player_pos = player.position;
        if (! player_pos) return false;
        user.position = new mp.Vector3(player_pos[0], player_pos[1], player_pos[2]);
        let player_name = player.firstName + ' ' + player.lastName;
        let user_name = user.firstName + ' ' + user.lastName;
        misc.log.debug(`Player: ${user_name} tp to ${player_name} at ${player_pos}`);
    },

    'teleport': (player, fullText, a, b, c) => {
        if (player.adminlvl < 1) return;
        if (!misc.isValueNumber(Number(a)) || !misc.isValueNumber(Number(b)) || !misc.isValueNumber(Number(c))) return player.outputChatBox("/tp posX posY posZ");
        let player_name = player.firstName + ' ' + player.lastName;
        let player_oldpos = player.position;
        player.position = new mp.Vector3(+a, +b, +c);
        misc.log.debug(`Player: ${player_name} teleport from ${player_oldpos} to ${a} ${b} ${c}`);
    },

    'kick': (user, fullText, playerId) => {
        if (user.adminlvl < 1) return;
        //console.log('user.guid='+user.guid);
        //console.log('guid='+guid);
        let playerOnlineID = misc.isNumber(playerId);
        let newTarget;
        if (!playerOnlineID && playerOnlineID!==0) {
            newTarget = user;
        } else {
            newTarget = mp.players.at(playerOnlineID);
            //console.log(newTarget);
            if(!newTarget) return user.outputChatBox("There is no player online with the ID given.");
        }
        newTarget.outputChatBox("You have been kicked from the server.");
        newTarget.kick(`Player: ${newTarget.name}[${playerOnlineID}] got kicked by ${user.guid}`);
        misc.log.debug(`Player: ${newTarget.name}[${playerOnlineID} got kicked by ${user.guid}`);
    },

});

