<h2>Sticky elements<span class="status review">Needs review. Check example centring</span></h2>

#### Usage:

A sticky element represents any HTML element that keeps in view even if you scroll.  
A sticky element consists of three parts:  
The sticky element itself, identified by a data-sticky attribute with a unique identifier for the element as value.  
A marker where it undocks (starts scrolling), identified by a data-sticky-undock attribute with the identifier as value.  
And a marker where it docks (stops scrolling), identified by a data-sticky-dock attribute with the identifier as value.  
Both markers are optional. If you omit the undock marker, the start of the document is used. If you omit the dock marker the end of the document is used.
<style>
#sticky .sample .spacer{
    height: 200px;
    border: 1px solid black;
}
</style>