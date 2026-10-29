var GT = window.GT || {};

GT.Choices = (function() {
    function render(container, choices, onSelect) {
        container.innerHTML = '';
        container.style.display = 'flex';

        var identityId = GT.State.get('protagonist.identity');

        choices.forEach(function(choice, index) {
            if (choice.condition && !GT.State.checkCondition(choice.condition)) return;
            if (choice.requiredIdentity && choice.requiredIdentity !== identityId) return;
            if (choice.requiredClue && !GT.NarrativeSystem.hasClue(choice.requiredClue)) return;

            var btn = document.createElement('button');
            btn.className = 'choice-btn';

            if (choice.isIdentitySpecific) {
                btn.classList.add('identity-choice');
            }
            if (choice.isShortEnding) {
                btn.classList.add('short-ending-choice');
            }
            if (choice.isDangerous) {
                btn.classList.add('dangerous-choice');
            }

            var choiceText = choice.text;
            if (choice.identityText && choice.identityText[identityId]) {
                choiceText = choice.identityText[identityId];
            }

            btn.textContent = choiceText;
            btn.style.animationDelay = (index * 0.1) + 's';

            btn.addEventListener('click', function() {
                GT.AudioSystem.playSFX('click');
                container.style.display = 'none';
                if (onSelect) onSelect(choice);
            });

            container.appendChild(btn);
        });
    }

    function hide(container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }

    return {
        render: render,
        hide: hide
    };
})();
