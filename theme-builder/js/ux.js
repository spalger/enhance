function targetToggle(target){
	if($(target).is(":visible")){
		$(target).slideUp(50);
	}else{
		$(target).slideDown(50);
	}
}