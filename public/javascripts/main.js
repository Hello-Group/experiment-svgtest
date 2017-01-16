$(function() {
    $('input').on('change', function(e) {
        var el =$(this)[0]; //get actual element 
        if (el.files && el.files.length > 0) {
            $(this).closest('form').submit();                    
        }    
    });    
})