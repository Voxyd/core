<?php
class Error extends Languages {

    public $_error = "";
    
    function DefaultAction() {
        $this->_error = $this->txt->Error->default;
        include_once(DIR_VIEW."vError.php");
    }
	
	function ErrorAction($err = "") {
        switch($err) {
            case 404 :
                $this->_error = $this->txt->Error->e404;
                break;
            default :
                $this->_error = $this->txt->Error->default;
        }
        include_once(DIR_VIEW."vError.php");
	}
};
?>