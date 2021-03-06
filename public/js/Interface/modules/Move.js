// Move module. Loaded in window.onload()
var Move = (function() {
    // Private
    var Copy = 0; // 0 : cut, 1 : copy
    var mvFolder_id = 0; // folder id where files/folders to move are located

    var mv = function(id) {
        // reset
        Move.Files = [];
        Move.Folders = [];

        if(Selection.Files.length == 0 && Selection.Folders.length == 0) {
            // cut only the file/folder selected
            if(id.length > 0) {
                if(id.substr(0, 1) == 'd') {
                    Move.Folders.push(id.substr(1));
                }
                if(id.substr(0, 1) == 'f')
                    Move.Files.push(id.substr(1));
            }
        }
        else {
            // cut all selected files/folders
            Move.Files = Selection.Files;
            Move.Folders = Selection.Folders;
        }
        mvFolder_id = Folders.id;
    }

    // Public
    // Files : Files to move (id)
    // Folders : Folders to move (id)
    return {
        Files : [],
        Folders : [],

        rename : function(id) {
            var elem = document.querySelector("#"+id);
            var name;
            var path;
            if(elem) {
                if(elem.hasAttribute("data-path")) {
                    path = elem.getAttribute("data-path");
                    if(elem.hasAttribute("data-title"))
                        name = elem.getAttribute("data-title");
                    else
                        name = elem.getAttribute("name");

                    if(document.querySelector("#nRename")) {
                        console.log("rename");
        				Box.hide();

        				var xhr = new XMLHttpRequest();
        				xhr.open("POST", "User/Rename", true);
        				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        				xhr.onreadystatechange = function()
        				{
        				    if(xhr.status == 200 && xhr.readyState == 4)
        				    {
        				        // To do : rename without reloading
                                console.log(xhr.responseText);
                                Folders.open(Folders.id);
        				    }
        				}
        				xhr.send("folder_id="+Folders.id+"&old="+encodeURIComponent(name)+"&new="+encodeURIComponent(document.querySelector("#nRename").value));
        			}
        			else {
                        Box.box_more = true;
        				document.querySelector("#box").innerHTML = txt.RightClick.mvItem+' : <input type="text" id="nRename" value="'+name+'" autocomplete="off" onkeypress="return Move.renameVerif(\''+id+'\', event);" autofocus>';
                        document.querySelector("#nRename").focus();
                        Box.show();
        			}
                }
            }
        },

        renameVerif : function(id, evt) {
			var keyCode = evt.which ? evt.which : evt.keyCode;
			if(keyCode == 13) { // Submit
				Move.rename(id);
				return false;
			}
			var interdit = '/\\:*?<>|"';
			if (interdit.indexOf(String.fromCharCode(keyCode)) >= 0)
				return false;
			return true;
		},

        cut : function(id) {
            Box.hide();
            Copy = 0;

            mv(id);
        },

        copy : function(id) {
            Box.hide();
            Copy = 1;

            mv(id);
        },

        paste : function() {
            Box.hide();
            var id = 0;
            var folderName;

            var p_folders = [];
            var p_files = [];

            if(Move.Files.length > 0 || Move.Folders.length > 0) {
                for(var i=0; i<Move.Files.length; i++) {
                    if(Move.Files[i].length > 0 && isNumeric(Move.Files[i]))
                        p_files.push(Move.Files[i]);
                }

                for(var i=0; i<Move.Folders.length; i++) {
                    if(Move.Folders[i].length > 0 && isNumeric(Move.Folders[i]))
                        p_folders.push(Move.Folders[i]);
                }

                p_folders = encodeURIComponent(p_folders.join('|'));
                p_files = encodeURIComponent(p_files.join('|'));

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "User/Mv", true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function()
                {
                    if(xhr.status == 200 && xhr.readyState == 4)
                    {
                        console.log(xhr.responseText);
                        Folders.open(Folders.id);
                    }
                }
                xhr.send("copy="+Copy+"&folder_id="+Folders.id+"&old_folder_id="+mvFolder_id+"&files="+p_files+"&folders="+p_folders);
            }
        },

        trash : function(t) {
            Box.hide();
            if(t.length > 1) {
                id = t.substr(1);
                if(isNumeric(id)) {
                    var request;
                    if(t.substr(0, 1) == 'f') {
                        request = "files="+id;
                    }
                    else if(t.substr(0, 1) == 'd') {
                        request = "folders="+id;
                    }
                    else
                        return false;

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "User/MvTrash", true);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    xhr.onreadystatechange = function()
                    {
                        if(xhr.status == 200 && xhr.readyState == 4)
                        {
                            console.log(xhr.responseText);
                            Folders.open(Folders.id);
                        }
                    }
                    xhr.send(request+"&trash="+Math.abs(Trash.State-1));
                }
            }
        },

        trashMultiple : function() {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "User/MvTrash", true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function()
            {
                if(xhr.status == 200 && xhr.readyState == 4)
                {
                    console.log(xhr.responseText);
                    Folders.open(Folders.id);
                }
            }
            xhr.send("folders="+Selection.Folders.join('|')+"&files="+Selection.Files.join('|')+"&trash="+Math.abs(Trash.State-1));
        }
    }
});
