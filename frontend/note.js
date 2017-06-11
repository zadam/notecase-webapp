let tags = {
    1: "<b>",
    2: "</b>",
    3: "<i>",
    4: "</i>",
    5: "<u>",
    6: "</u>",
    9: "<s>",
    10: "</s>"
};

function noteChanged() {
    let note = globalNote;

    let contents = $('#noteDetail').summernote('code');

    let title = $('#noteTitle').val();

    $("#tree").fancytree('getNodeByKey', note.detail.note_id).setTitle(title);

    html2notecase(contents, note);

    note.detail.note_title = title;

    $.ajax({
        url: baseUrl + 'notes/' + note.detail.note_id,
        type: 'PUT',
        data: JSON.stringify(note),
        contentType: "application/json",
        success: function(result) {
            message("Saved!");
        }
    });
}

$(document).ready(function() {
    $("#noteTitle").on('input', function() {
        noteChanged();
    });

    $('#noteDetail').summernote({
        airMode: true,
        callbacks: {
            onChange: noteChanged
        }
    });
});
  
var globalNote;

function setParent(noteId, newParentKey, successCallback) {
    let newNoteName = "new note";

    $.ajax({
        url: baseUrl + 'notes/' + nodeId + '/setParent/' + newParentKey,
        type: 'PUT',
        contentType: "application/json",
        success: function(result) {
            successCallback();
        }
    });
}

function createNote(node, parentKey, target) {
    let newNoteName = "new note";

    $.ajax({
        url: baseUrl + 'notes/' + parentKey + '/children' ,
        type: 'POST',
        data: JSON.stringify({
            note_title: newNoteName,
            target: target,
            target_note_id: node.key
        }),
        contentType: "application/json",
        success: function(result) {
            let newNode = {
                "title": newNoteName,
                "key": result.note_id,
                "note_id": result.note_id
            };

            if (target == 'after') {
                node.appendSibling(newNode).setActive(true);
            }
            else {
                node.addChildren(newNode).setActive(true);

                node.folder = true;
                node.renderTitle();
            }

            message("Created!");
        }
    });
}

function loadNote(noteId) {
    $.get(baseUrl + 'notes/' + noteId).then(function(note) {
        globalNote = note;

        $("#noteTitle").val(note.detail.note_title);

        let noteText = notecase2html(note);

        $('#noteDetail').summernote('code', noteText);
    });
}