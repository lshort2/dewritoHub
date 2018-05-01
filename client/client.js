//modal closer
Meteor.modals ={
  closeModal : (target, target2) =>{
    $(document).bind("mouseup touchend", function (e) {
      var container = $(target2);
      var modal = $(target);

      if (!container.is(e.target) // if the target of the click isn't the container...
      && container.has(e.target).length === 0) // ... nor a descendant of the container
      {
        modal.hide();
      }
    });
  },
  closeDropdown: (trigger, dropdown)=>{
    $(document).bind("mouseup touchend", function (event) {
      if (!event.target.matches(trigger)) {
        $(dropdown).hide()
      }
    })
  }
}
