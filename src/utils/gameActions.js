function travel(r, c, color, gameState, direction, isClosed) {
    if (r < 0 || r > 16 || c < 0 || c > 16) {
        isClosed.value = true;
        return 0;
    }
    else if (gameState[r][c] === color) {
        return travel(r+direction[0], c+direction[1], color, gameState, direction, isClosed) + 1;
    }
    else if (gameState[r][c]) isClosed.value = true;

    return 0;
}

export function moveResult(r, c, color, initialColor, gameState) {
    const directions = [[0, 1], [1, 1], [1, 0], [1, -1]];
    let lengthTracker = [];
    let closedTracker = [];
    let result = "";

    for (let i = 0; i < 4; i++) {
        const reverse = directions[i].map(x => {return -x});
        closedTracker.push([]);

        const isClosed = {value: false};
        const direction1 = travel(r+directions[i][0], c+directions[i][1], color, gameState, directions[i], isClosed);
        closedTracker[i].push(isClosed.value);

        isClosed.value = false;
        const direction2 = travel(r+reverse[0], c+reverse[1], color, gameState, reverse, isClosed);
        closedTracker[i].push(isClosed.value);

        lengthTracker.push([direction1, direction2]);
        const lengthOfRow = direction1 + direction2 + 1;

        if (lengthOfRow >= 5 && color !== initialColor) {
            if (color === "b") result = "Black wins.";
            else result = "White wins.";
        }
        else if (lengthOfRow === 5) {
            if (color === "b") result = "Black wins.";
            else result = "White wins.";
        }
        else if (lengthOfRow > 5) {
            result = "Illegal - First player is only allowed rows of five.";
        }
    }

    if (color === initialColor) {
        let openThreeCounter = 0;
        let openFourCounter = 0;
        for (let i = 0; i < 4; i++) {
            if (lengthTracker[i][0] === 2 && lengthTracker[i][1] === 0 && !closedTracker[i][0] && !closedTracker[i][1]) openThreeCounter += 1;
            else if (lengthTracker[i][1] === 2 && lengthTracker[i][0] === 0 && !closedTracker[i][1] && !closedTracker[i][0]) openThreeCounter += 1;
            else if (lengthTracker[i][0] === 3 && lengthTracker[i][1] === 0 && !closedTracker[i][0] && !closedTracker[i][1]) openFourCounter += 1;
            else if (lengthTracker[i][1] === 3 && lengthTracker[i][0] === 0 && !closedTracker[i][1] && !closedTracker[i][0]) openFourCounter += 1;
        }
        if (openThreeCounter >= 2) result = "Illegal - First player cannot make open 3-3s.";
        else if (openFourCounter >= 2) result = "Illegal - First player cannot make open 4-4s.";
    }

    return result;
}
