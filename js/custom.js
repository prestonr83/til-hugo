function addCopyButtons(clipboard) {
    document.querySelectorAll('pre > code').forEach(function(codeBlock) {
        if (codeBlock.className = '') {
            return
        }
        var table = codeBlock.parentNode.parentNode.parentNode.parentNode
        var row = table.insertRow(0);
        var cell = row.insertCell();
        var cell = row.insertCell();
        cell.innerHTML = "<BR>"
        var button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.innerText = 'Copy';
        button.addEventListener('click', function() {
            clipboard.writeText(codeBlock.innerText).then(function() {
                /* Chrome doesn't seem to blur automatically,
                   leaving the button in a focused state. */
                button.blur();

                button.innerText = 'Copied!';

                setTimeout(function() {
                    button.innerText = 'Copy';
                }, 2000);
            }, function(error) {
                button.innerText = 'Error';
            });
        });
        cell.appendChild(button)
    });
}