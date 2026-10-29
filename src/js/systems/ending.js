var GT = window.GT || {};

GT.EndingSystem = (function() {
    function triggerEnding(endingId) {
        var ending = GT.EndingData[endingId];
        if (!ending) {
            GT.Logger.error('Ending', 'Ending not found: ' + endingId);
            return;
        }

        var unlocked = GT.State.get('unlockedEndings') || [];
        if (unlocked.indexOf(endingId) === -1) {
            unlocked.push(endingId);
            GT.State.set('unlockedEndings', unlocked);
            GT.Storage.saveEndings(unlocked);
        }

        GT.State.increment('statistics.endingsReached');

        var typeLabel = '';
        switch (ending.type) {
            case 'short_bad': typeLabel = '短线坏结局'; break;
            case 'short_neutral': typeLabel = '短线中性结局'; break;
            case 'long_bad': typeLabel = '长线坏结局'; break;
            case 'long_neutral': typeLabel = '长线中性结局'; break;
            case 'long_good': typeLabel = '长线好结局'; break;
            case 'hidden': typeLabel = '隐藏结局'; break;
            case 'true': typeLabel = '真结局'; break;
            default: typeLabel = '结局';
        }

        GT.Engine.showEndingPopup({
            id: endingId,
            name: ending.name,
            description: ending.description,
            type: ending.type,
            typeLabel: typeLabel
        });

        GT.AudioSystem.stopBGM();
        if (ending.bgm) {
            GT.AudioSystem.playBGM(ending.bgm);
        }

        GT.EventBus.emit('ending:triggered', endingId, ending);
        GT.AchievementSystem.checkEndingAchievements(endingId);
    }

    function getUnlockedEndings() {
        return GT.State.get('unlockedEndings') || [];
    }

    function isEndingUnlocked(endingId) {
        var unlocked = GT.State.get('unlockedEndings') || [];
        return unlocked.indexOf(endingId) !== -1;
    }

    function getEndingInfo(endingId) {
        return GT.EndingData[endingId] || null;
    }

    function getEndingsByType(type) {
        var results = [];
        for (var id in GT.EndingData) {
            if (GT.EndingData.hasOwnProperty(id) && GT.EndingData[id].type === type) {
                results.push({ id: id, data: GT.EndingData[id] });
            }
        }
        return results;
    }

    return {
        triggerEnding: triggerEnding,
        getUnlockedEndings: getUnlockedEndings,
        isEndingUnlocked: isEndingUnlocked,
        getEndingInfo: getEndingInfo,
        getEndingsByType: getEndingsByType
    };
})();
