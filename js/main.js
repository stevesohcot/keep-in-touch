var arrFriends = [];

$( document ).ready(function() {

	LoadList();

	$('#modal_ItemAdd').on('shown.bs.modal', function () {
	    $('#txtItemAdd').focus();
	});
	
	$('#tblFriendList').on('click', '.display_friend_name', function () {
	   EditItemShow(this.innerHTML);
	});

});

function RefreshList() {

	$('#tblFriendList tbody').html('');

	// #tblContainer is an outer container to hide the responsive table if empty

	if (arrFriends.length == 0) {
		$('#EmptyListInstructions').show();
		$('#tblContainer, #headerMyList').hide();
	} else {
		$('#EmptyListInstructions').hide();
		$('#tblContainer, #headerMyList').show();
	}
	

	$.each(arrFriends, function(index, value) {
		$('#tblFriendList tbody').append('<tr><td class="display_friend_name">' + value + '</td></tr>');
	});
	
	
	if (arrFriends.length > 0 &&  arrFriends.length < 3) {
		$('#EditItemInstructions').show();
	} else {
		$('#EditItemInstructions').hide();
	}

}


function AddItem() {

	if ($('#txtItemAdd').val() != '') {

		arrFriends.push( $('#txtItemAdd').val() );
		SaveList();
		$('#modal_ItemAdd').modal('hide');
		$('#txtItemAdd').val('');
		
		$('#notification_type').html('Added');
		DisplayNotification('Added');

	}
}

function EditItemShow(TheItem) {
	$("#modal_ItemEdit").modal('show');
	$('#txtItemEdit_Orig').val(TheItem);
	$('#txtItemEdit').val(TheItem);
	$('#txtItemEdit').focus();
}


function ChangeItem(TheAction) {

	var TheItem_Orig 	= $('#txtItemEdit_Orig').val();
	var TheItem_New		= $('#txtItemEdit').val();
	var index 			= arrFriends.indexOf(TheItem_Orig);

	// If you're saving the content, just update the text
	// Else, delete the item (and optionally add it back in)
	if (TheAction == "SaveChanges") {

		arrFriends[index] = TheItem_New;
		DisplayNotification('Updated');

	} else {

		if (index > -1) {
			arrFriends.splice(index, 1);
		}
	}

	switch (TheAction) {

		case "Delete":
			// Item deleted above; don't add it back in
			DisplayNotification('Deleted');
					

			break;
		case "MoveToTop":
			arrFriends.unshift(TheItem_New);
			break;
		case "MoveToBottom":
			arrFriends.push(TheItem_New);
			break;
	}

	SaveList();
	$('#modal_ItemEdit').modal('hide');
	$('#txtItemEdit_Orig').val('');
	$('#txtItemEdit').val('');

}

function DisplayNotification(TheType) {
	$('#notification_type').html(TheType);
	$('#NotifyContact').show().delay(2000).fadeTo("slow", 0.00, function(){ //fade
         $(this).slideUp("slow");
         $(this).fadeTo("fast",1.00);
     });

}

function SaveList() {
	localStorage.setItem("FriendList", JSON.stringify(arrFriends));
	RefreshList();
}

function LoadList() {

	arrFriends = []; // reset - no matter what

	// store in a local variable, incase null
	var RawData = localStorage.getItem("FriendList");

	// only process if not null
	if (RawData != null) {

		var ValueSaved = JSON.parse(RawData);
		
		$.each(ValueSaved, function(i,v) {
			arrFriends.push(ValueSaved[i] );
		});

	}

	RefreshList();
}
