// $Workfile:   tabs.js  $
// $Author:     kadet $
// $Date:       Feb 29 2007 11:41:40  $
//
//  Functions for the creating tabs from html table


var PROPERTIES_TABLE_ID = 'propertiesTable';

var TABS_AREA_ID = 'tabsArea';

var MINIMAL_NUMBER_OF_TABS_FOR_TABS_CREATING = 2;


/**
 *  PROPERTIES TABLE HEADER
 */
var NUMBER_OF_CHILDREN_OF_PROPERTIES_TABLE_HEADER = 3;


/**
 *  EXPANDED PROPERTY HEADER
 */
var NUMBER_OF_CHILDREN_OF_EXPANDED_PROPERTY_HEADER = 3;

/**
 *
 *  HTML TAGS
 *
 */

var TBODY_TAG = 'tbody';

var TR_TAG = 'tr';

var TD_TAG = 'td';

var TH_TAG = 'th';

var DIV_TAG = 'div';

var A_TAG = 'a';

var IMG_TAG = 'img';

var SPAN_TAG = 'span';



/**
 *
 *  WCM PROPERTY CLASSES
 *
 */

var WCM_FORM_MAIN_HEADER = 'wcmFormMainHeader';


/**
 *
 *  ROW COLOR CLASS
 *
 */

var WCM_FORM_ROW_ODD_CLASS = 'wcmFormRowOdd';

var WCM_FORM_ROW_EVEN_CLASS = 'wcmFormRowEven';

var WCM_PROPERTY_ROW = "WcmPropertyRow";

var WCM_FORM_ROW_CLASSES = [
    WCM_FORM_ROW_EVEN_CLASS,
    WCM_FORM_ROW_ODD_CLASS
];




/**
 *
 *  HTML ELEMENTS ATTRIBUTES
 *
 */

var TAB_ATTRIBUTE_NAME = 'tabID';

var ON_CLICK_IE_ATTRIBUTE_NAME = 'onclick';

var ON_CLICK_CHROME_ATTRIBUTE_NAME = 'click';

var ON_MOUSE_OVER_IE_ATTRIBUTE_NAME = 'onmouseover';

var ON_MOUSE_OVER_CHROME_ATTRIBUTE_NAME = 'mouseover';

var ON_MOUSE_OUT_IE_ATTRIBUTE_NAME = 'onmouseout';

var ON_MOUSE_OUT_CHROME_ATTRIBUTE_NAME = 'mouseout';

var CLASS_ATTRIBUTE_NAME = 'class';

var OBJECT_ID_ATTRIBUTE_NAME = 'objectId';

var ID_ATTRIBUTE_NAME = 'id';

var VALUE_ATTRIBUTE_NAME = 'value';

var COLSPAN_ATRIBUTE_NAME = 'colspan';



/**
 *
 *  CLASSES FOR TABS (For CSS)
 *
 */

var TAB_CLASS_NAME = 'tab';

var TAB_AREA_CLASS_NAME = 'tabs';

var SELECTED_TAB_CLASS_NAME = 'tabSelected';

var TAB_TEXT_CLASS_NAME = 'tabText';



/**
 *
 *  KEY NAME FOR SAVING TAB INDEX IN SESSION STORAGE
 *
 */

var TAB_INDEX_NAME_FOR_SAVING = 'tabIndex';



var FIRST_TAB_INDEX = 0;

var propertiesRow = [];
var tabsName = [];

function makeAndShowTabs () {

    initPropertiesAndTabsFromPropertiesTable();
    var tabNames = getTabsName();
    if (tabNames.length >= MINIMAL_NUMBER_OF_TABS_FOR_TABS_CREATING) {
        initTabs(tabNames);
        onTabClick(getLastTabIndex());
    }

}

function setPropertiesRow(tr)
{
    propertiesRow.push(tr);
}

function getPropertiesRow(){
    return propertiesRow;
}
/**
 *
 *  GETTING TAB NAMES
 *
 */

function setTabsName(theTabName)
{
    tabsName.push(theTabName);
}

function getTabsName()
{
    return tabsName;
}



function initPropertiesAndTabsFromPropertiesTable () {

    var propertiesTable  = document.getElementById(PROPERTIES_TABLE_ID);
    if (propertiesTable != null) {

        var tBody = propertiesTable.getElementsByTagName(TBODY_TAG)[0]
        var allTrElements = tBody.getElementsByTagName(TR_TAG);

        for(var i = 0; i<allTrElements.length; i++)
        {
            if(isRowPropertyTable(allTrElements[i]))
            {
                setPropertiesRow(allTrElements[i]);

                if (!getTabsName().contains(allTrElements[i].getAttribute(TAB_ATTRIBUTE_NAME))) {
                    setTabsName(allTrElements[i].getAttribute(TAB_ATTRIBUTE_NAME));
                }

            }
        }

    }
}

    function isRowPropertyTable(tr){
        if(tr.className.indexOf(WCM_PROPERTY_ROW) !=-1 && tr.getAttribute(TAB_ATTRIBUTE_NAME))
        return true;
        return false;
    }



/**
 *  Properties Table Header is <tr> element that located at the beginning of all properties
 */
function isPropertiesTableHeader (property) {
    var isPropertiesTableHeader = true;
    var thChildren = property.getElementsByTagName(TH_TAG);

    if (thChildren.length != NUMBER_OF_CHILDREN_OF_PROPERTIES_TABLE_HEADER
        || !checkElementsOnHavingClassNameAttributeValue(thChildren, WCM_FORM_MAIN_HEADER)) {
        isPropertiesTableHeader = false;
    }

    return isPropertiesTableHeader;
}


function isExpandedPropertyHeader(property) {
    var isExpandedPropertyHeader = true;
    var trChildren = property.getElementsByTagName(TD_TAG);
    if (trChildren.length != NUMBER_OF_CHILDREN_OF_EXPANDED_PROPERTY_HEADER
        || !checkElementsOnHavingClassNameAttributeValue(trChildren, WCM_FORM_MAIN_HEADER)) {
        isExpandedPropertyHeader = false;
    }
    return isExpandedPropertyHeader;
}


/**
 *
 * @return {boolean}   true - if all elements has defined className
 */
function checkElementsOnHavingClassNameAttributeValue(elements, classNameAttributeValue) {
    var result = true;
    for (var elementIndex = 0; elementIndex < elements.length; ++elementIndex) {
        var className = elements[elementIndex].className;
        if (className == null || className != classNameAttributeValue) {
            result = false;
        }
    }
    return result;
}

/**
 *  For IE 8 method "contains" for Array
 *
 * @param checkedElement
 * @return {boolean}  true - if array contains element, false - if not contains
 */
Array.prototype.contains = function (checkedElement) {
    for (var element in this) {
        if (this[element] === checkedElement) {
            return true;
        }
    }
    return false;
}


/**
 *
 *  INIT TABS
 *
 */


/**
 *
 *
 *
 */
function initTabs (tabNames) {
    var tabs = createTabs(tabNames);
    initTabsArea();
    appendTabsToTabsArea(tabs);
}



function createTabs (tabNames) {
    var tabs = [];
    for (var tabNameIndex = 0; tabNameIndex < tabNames.length; ++tabNameIndex) {
        var tabName = tabNames[tabNameIndex];
        tabs.push(
            createTab(tabNameIndex,
                tabName,
                new Function('onTabClick(' + tabNameIndex + ')'),
                new Function(),
                new Function()
            )
        );
    }
    return tabs;
}



function createTab (tabName, tabValue, onClickFunction, onMouseOverFunction, onMouseOutFunction) {
    var tab = document.createElement(DIV_TAG);
    tab.name = tabName;
    tab.appendChild(
        createSpan(tabValue, TAB_TEXT_CLASS_NAME)
    );
    setMouseEventsOnElement(tab, onClickFunction, onMouseOverFunction, onMouseOutFunction);
    return tab;
}



/**
 *  Located in the tab and used to show text value of tab
 */
function createSpan (innerText, classAttributeValue) {
    var span = document.createElement(SPAN_TAG);
    span.className = classAttributeValue;

    if (typeof(span.innerText) != String(undefined)) {
        span.innerText = innerText;
    } else {
        span.textContent = innerText;                           //  For Mozilla Based Browsers
    }

    return span;
}



function setMouseEventsOnElement (element, onClick, onMouseOver, onMouseOut) {
    try {

        element.attachEvent(ON_MOUSE_OUT_IE_ATTRIBUTE_NAME, onMouseOut);                       //For IE
        element.attachEvent(ON_MOUSE_OVER_IE_ATTRIBUTE_NAME, onMouseOver);
        element.attachEvent(ON_CLICK_IE_ATTRIBUTE_NAME, onClick);

    } catch (e) {

        element.addEventListener(ON_MOUSE_OUT_CHROME_ATTRIBUTE_NAME, onMouseOut, false);      //For Mozilla-based browsers
        element.addEventListener(ON_MOUSE_OVER_CHROME_ATTRIBUTE_NAME, onMouseOver, false);
        element.addEventListener(ON_CLICK_CHROME_ATTRIBUTE_NAME, onClick, false);

    }
}


/**
 *  Create place for tabs
 */
function initTabsArea () {
    var tabsArea = document.createElement(TD_TAG);
    tabsArea.setAttribute(ID_ATTRIBUTE_NAME, TABS_AREA_ID);
    var tabsAreaWrapper = document.createElement(TR_TAG);

    tabsAreaWrapper.appendChild(tabsArea);
    appendTabsAreaWrapperToPropertiesTable(tabsAreaWrapper);
}

/**
 *  Append tabs area wrapper to the tbody of table before the header of the properties table
 */
function appendTabsAreaWrapperToPropertiesTable (tabsAreaWrapper) {
    var table = document.getElementById(PROPERTIES_TABLE_ID);
    var tBody = table.getElementsByTagName(TBODY_TAG)[0];
    var propertiesHeader
        = getHeaderOfPropertiesTable(table);
    tBody.insertBefore(tabsAreaWrapper, propertiesHeader);
}



function getHeaderOfPropertiesTable (propertyTable) {
    var headerOfPropertiesTable = null;
    var trElements = propertyTable.getElementsByTagName(TBODY_TAG)[0].getElementsByTagName(TR_TAG);
    for (var trIndex = 0; trIndex < trElements.length; ++trIndex) {
        var tr = trElements[trIndex];
        if (isPropertiesTableHeader(tr)) {
            headerOfPropertiesTable = tr;
            break;
        }
    }
    if (headerOfPropertiesTable == null)
        throw new Error('There is no header in table');
    return headerOfPropertiesTable;
}

function appendTabsToTabsArea (tabs) {
    var tabsArea =  document.getElementById(TABS_AREA_ID);
    appendElementsToNode(tabsArea, tabs);
    tabsArea.colSpan = 3;
}


function appendElementsToNode (node, elements) {
    for (var elementIndex = 0; elementIndex < elements.length; ++elementIndex) {
        node.appendChild(elements[elementIndex]);
    }
}


/**
 *
 *  ON CLICK ACTIONS
 *
 */


/**
 *  Action on click on the tab
 *  Hide all properties and show just required by tab
 *
 * @param tabIndex      tab.name
 */
function onTabClick (tabIndex) {

    if(propertiesRow == null || tabsName == null)
        initPropertiesAndTabsFromPropertiesTable();

    hide(getPropertiesRow());
    var tabValue = getTabValueByName(tabIndex);
    show(extractPropertiesForShowing(tabIndex, tabValue, getPropertiesRow()));
    changeTab(tabIndex);
    saveTabIndexOfSelectedTab(tabIndex);
}


function hide (elements) {
    setVisibleOfElements(elements, false);
}



function show (elements) {
    setVisibleOfElements(elements, true);
}



/**
 * @param visibility    True boolean value - make elements visible, False value - make elements invisible
 * @param elements      elements for changing visibility
 */
function setVisibleOfElements (elements, visibility) {

    for (var elementIndex = 0; elementIndex < elements.length; ++elementIndex) {
        elements[elementIndex].style.display = visibility ? '' : 'none';
    }

}



/**
 *  Tab value is a text on the tab
 */
function getTabValueByName (name) {
    var tab = getTabByName(name);
    return getTabValue(tab);
}



function getTabByName (name) {
    var tabsArea = document.getElementById(TABS_AREA_ID);
    var tab = null;
    var tabs = tabsArea.getElementsByTagName(DIV_TAG);
    for (var tabIndex = 0; tabIndex < tabs.length; ++tabIndex) {
        if (tabs[tabIndex].name == name) {
            tab = tabs[tabIndex];
            break;
        }
    }
    if (tab == null)
        throw new Error("Tab Name Not Founded");
    return tab;
}


function getTabValue (tab) {
    var span = tab.getElementsByTagName(SPAN_TAG)[0];
    return span.innerHTML;
}



/**
 *  Get properties that required for showing by clicking tab from all properties
 *
 * @param tabIndex              tab.name
 * @param requiredTabValue      value of tab(text on the tab)
 * @param properties            all properties for checking
 * @return {Array}              properties that required to show
 */
function extractPropertiesForShowing (tabIndex, requiredTabValue, properties) {

    var propertiesForShowing = [],
        colorIndex = 0;

    for (var propertyIndex = 0; propertyIndex < properties.length; ++propertyIndex) {

        var property = properties[propertyIndex];
        var tabAttributeValue = property.getAttribute(TAB_ATTRIBUTE_NAME);

     if (tabAttributeValue == requiredTabValue) {

            //  If tab value is equal with required tab value this property must be in the array of the properties for showing
         setPropertyColor(property, WCM_FORM_ROW_CLASSES[colorIndex]);
         colorIndex = increaseColorIndex(colorIndex);
         propertiesForShowing.push(properties[propertyIndex]);


        }

    }
    return propertiesForShowing;

}


/**
 *  Color of property is setting by defined className of all children
 */
function setPropertyColor (property, color) {

    var tdElements
        = property.getElementsByTagName(TD_TAG);

    for (var tdIndex = 0; tdIndex < tdElements.length; ++tdIndex) {
        tdElements[tdIndex].className = color;
    }

}



function increaseColorIndex (colorIndex) {

    ++colorIndex;

    if (colorIndex == WCM_FORM_ROW_CLASSES.length) {
        colorIndex = 0;
    }

    return colorIndex;

}



/**
 *  Change color of pressed tab and of other tabs
 *
 * @param pressedTabIndex       index of pressed tab (0, 1, ...)
 */
function changeTab (pressedTabIndex) {

    var tabsArea = document.getElementById(TABS_AREA_ID);

    var tabs = tabsArea.getElementsByTagName(DIV_TAG);

    for (var tabIndex = 0; tabIndex < tabs.length; ++tabIndex) {
        tabs[tabIndex].className = TAB_CLASS_NAME;
    }

    tabs[pressedTabIndex].className = TAB_CLASS_NAME + ' ' + SELECTED_TAB_CLASS_NAME;
}



/**
 *  Save tab index of current file to the session storage (if exists)
 */
function saveTabIndexOfSelectedTab (tabIndex) {

    var objectId = getObjectIdValue(
        getObjectIdElement());
    try {
        if (objectId != null) {
            sessionStorage.setItem(TAB_INDEX_NAME_FOR_SAVING + '.' + objectId, tabIndex);
        }
    } catch (e) {

    }

}


/**
 *  Get element that must have attribute "objectId"
 */
function getObjectIdElement () {
    return getHeaderOfPropertiesTable(
        document.getElementById(PROPERTIES_TABLE_ID));
}



/**
 *  Get value of attribute "objectId" from element
 */
function getObjectIdValue (element) {
    return element == null ? null : element.getAttribute(OBJECT_ID_ATTRIBUTE_NAME);
}



/**
 * @return {*}   index (== name) of last selected tab. Getting from the session storage
 */
function getLastTabIndex () {

    var tabIndex = null;

    var objectId = getObjectIdValue(
        getObjectIdElement());

    var key = TAB_INDEX_NAME_FOR_SAVING + (objectId != null ? '.' + objectId : '');

    try {

        tabIndex = sessionStorage.getItem(key);

        if (null == tabIndex || isNaN(tabIndex)) {
            tabIndex = FIRST_TAB_INDEX;
        }

    } catch (e) {
        tabIndex = FIRST_TAB_INDEX;
    }

    return tabIndex;
}

