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
 *  PROPERTY FOOTER
 */
var NUMBER_OF_CHILDREN_OF_PROPERTY_FOOTER = 1;


/**
 *  SYSTEM PROPERTY HEADER
 */
var NUMBER_OF_TH_CHILDREN_OF_SYSTEM_PROPERTIES = 1;

var NUMBER_OF_A_CHILDREN_OF_SYSTEM_PROPERTIES = 2;

var NUMBER_OF_IMG_CHILDREN_OF_SYSTEM_PROPERTIES = 2;



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



function makeAndShowTabs () {

    var properties
        = getPropertiesFromPropertiesTable();
    var tabNames
        = getTabNamesFromProperties(properties);
    if (tabNames.length >= MINIMAL_NUMBER_OF_TABS_FOR_TABS_CREATING) {
        initTabs(tabNames);
        onTabClick(getLastTabIndex());
    }

}


/**
 *
 *  GETTING TAB NAMES
 *
 */



function getPropertiesFromPropertiesTable () {
    var properties = [];
    var propertiesTable
        = getPropertiesTable();
    if (propertiesTable != null) {
        properties = getPropertiesFromTable(propertiesTable);
    }
    return properties;
}



function getPropertiesTable () {
    return document.getElementById(PROPERTIES_TABLE_ID);
}



function getPropertiesFromTable (table) {
    var properties = [];
    var tBody = getTBodyFromTable(table);
    var allTrElements = tBody.getElementsByTagName(TR_TAG);
    properties
        = getPropertiesFromTrElements(allTrElements);
    return properties;
}


/**
 *
 */

/**
 *  Not every <tr>-element in table is property. There are some other <tr> elements (<tr> for showing class name and reference to file are not properties)
 *
 * @param trElements        all Trs from table
 * @return {Array}          array of <tr> which are properties
 */
function getPropertiesFromTrElements (trElements) {
    var properties = [];
    var currentTrIndex = 0;
    var tr = trElements[currentTrIndex];
    while (!isPropertiesTableHeader(tr)) {
        tr = trElements[++currentTrIndex];
    }
    ++currentTrIndex;
    if (currentTrIndex < trElements.length) {
        var endElementIndex = trElements.length - 1;
        properties = getSubArray(trElements, currentTrIndex, endElementIndex);
    }
    return properties;
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




function getSubArray (array, begin, end) {
    var subArray = [];
    checkArrayLimit(begin, end, array)
    for (var arrayIndex = begin; arrayIndex <= end; ++arrayIndex) {
        subArray.push(array[arrayIndex]);
    }
    return subArray;
}



function checkArrayLimit (begin, end, arrayLength) {
    if (begin >= 0 && begin <= arrayLength
        && end <= arrayLength
        && begin <= end) {
        throw new Error("Not correct array limits");
    }
}





function getTabNamesFromProperties (properties) {
    var tabNames
        = getTabNamesFromPropertiesSkippingExpandedAndSystemProperties(properties, TAB_ATTRIBUTE_NAME);
    return tabNames;
}



/**
 *  Get array of not repeated values of properties attribute with name tabAttributeName
 *  Function skips all system properties cause it hasn't tab attribute
 *  It also skips all inner properties wrapped by expanded property header and property footer
 */
function getTabNamesFromPropertiesSkippingExpandedAndSystemProperties (properties, tabAttributeName) {

    var tabNames = [];

    for (var propertyIndex = 0; propertyIndex < properties.length; ++propertyIndex) {

        var property = properties[propertyIndex];
        if (isSystemPropertyHeader(property)) {

            propertyIndex = skipToPropertyFooter(properties, propertyIndex);
            ++propertyIndex;

        } else {

            var tabName = property.getAttribute(tabAttributeName);
            if (tabName != null) {
                addToArrayIfElementNotYetExists(tabNames, tabName);
            }

            //  we don't search for tab in properties wrapped by expanded property header and footer
            if (isExpandedPropertyHeader(property)) {

                propertyIndex = skipToPropertyFooter(properties, propertyIndex);
                ++propertyIndex;

            }

        }

    }

    return tabNames;
}



/**
 *  Check on system property header
 *  System property header is an <tr>-element which located at the end of properties and
 *      it is a beginning of elements which are showing any system data about file
 *
 */
function isSystemPropertyHeader (property) {

    var trChildren = property.getElementsByTagName(TH_TAG);

    var isSystemProperty = true;

    if (trChildren.length != NUMBER_OF_TH_CHILDREN_OF_SYSTEM_PROPERTIES
        || !checkElementsOnHavingClassNameAttributeValue(trChildren, WCM_FORM_MAIN_HEADER)) {
        isSystemProperty = false;
    } else {
        for (var childIndex = 0; childIndex < trChildren.length; ++childIndex) {
            if (!checkElementOnHavingDefinedChildren(trChildren[childIndex], A_TAG, NUMBER_OF_A_CHILDREN_OF_SYSTEM_PROPERTIES)
                || !checkElementOnHavingDefinedChildren(trChildren[childIndex], IMG_TAG, NUMBER_OF_IMG_CHILDREN_OF_SYSTEM_PROPERTIES)
                ) {
                isSystemProperty = false;
            }
        }
    }

    return isSystemProperty;
}





function skipToPropertyFooter (properties, currentPropertyIndex) {

    var property
        = properties[currentPropertyIndex];
    while (!isPropertyFooter(property)) {
        property
            = properties[++currentPropertyIndex];
    }

    return currentPropertyIndex;
}




function isPropertyFooter(property) {
    var isPropertyFooter = true;
    var tdChildren = property.getElementsByTagName(TD_TAG);
    if (tdChildren.length != NUMBER_OF_CHILDREN_OF_PROPERTY_FOOTER) {
        isPropertyFooter = false;
    } else {
        isPropertyFooter
            = checkElementsOnHavingClassNameAttributeValue(tdChildren, WCM_FORM_MAIN_HEADER);
    }
    return isPropertyFooter;
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




function addToArrayIfElementNotYetExists (array, element) {
    if (!array.contains(element)) {
        array.push(element);
    }
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
 * @return {boolean}    true - if element has defined number of defined children
 */
function checkElementOnHavingDefinedChildren (element, childTagName, childCount) {
    var elementHasSuchChildren = true;
    var children
        = element.getElementsByTagName(childTagName);
    if (children.length != childCount) {
        elementHasSuchChildren = false;
    }
    return elementHasSuchChildren;
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
    var tabsArea = createTabsArea();
    var tabsAreaWrapper
        = createTabsAreaWrapper();
    tabsAreaWrapper.appendChild(tabsArea);
    appendTabsAreaWrapperToPropertiesTable(tabsAreaWrapper);
}



function createTabsArea () {
    var tabsArea = document.createElement(TD_TAG);
    tabsArea.setAttribute(ID_ATTRIBUTE_NAME, TABS_AREA_ID);
    return tabsArea;
}



function createTabsAreaWrapper () {
    var tabsAreaWrapper = document.createElement(TR_TAG);
    return tabsAreaWrapper;
}


/**
 *  Append tabs area wrapper to the tbody of table before the header of the properties table
 */
function appendTabsAreaWrapperToPropertiesTable (tabsAreaWrapper) {
    var table = getPropertiesTable();
    var tBody = getTBodyFromTable(table);
    var propertiesHeader
        = getHeaderOfPropertiesTable(table);
    tBody.insertBefore(tabsAreaWrapper, propertiesHeader);
}



function getHeaderOfPropertiesTable (propertyTable) {
    var headerOfPropertiesTable = null;
    var trElements = getTBodyFromTable(propertyTable).getElementsByTagName(TR_TAG);
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



function getTBodyFromTable (table) {
    return table.getElementsByTagName(TBODY_TAG)[0];
}




function appendTabsToTabsArea (tabs) {
    var tabsArea = getTabsArea();
    appendElementsToNode(tabsArea, tabs);
    tabsArea.colSpan = 3;
}



function getTabsArea () {
    return document.getElementById(TABS_AREA_ID);
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
    var properties
        = getPropertiesFromPropertiesTable();
    hide(properties);
    var tabValue = getTabValueByName(tabIndex);
    show(
        extractPropertiesForShowing(tabIndex, tabValue, properties));
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
    var tabsArea = getTabsArea();
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

        if (tabAttributeValue == null) {

            if (isSystemPropertyHeader(property)) {

                //  System properties are required by every tab clicking

                propertyIndex = addPropertiesToArrayWhileNotPropertyFooter(properties, propertyIndex, propertiesForShowing);
                propertiesForShowing.push(properties[propertyIndex]);

            } else if (tabIndex == FIRST_TAB_INDEX) {

                //  Properties without tab are required by clicking on the first tab

                if (isExpandedPropertyHeader(property)) {

                    propertyIndex = addPropertiesToArrayWhileNotPropertyFooter(properties, propertyIndex, propertiesForShowing);
                    propertiesForShowing.push(properties[propertyIndex]);

                } else {

                    setPropertyColor(property, WCM_FORM_ROW_CLASSES[colorIndex]);
                    colorIndex = increaseColorIndex(colorIndex);
                    propertiesForShowing.push(properties[propertyIndex]);

                }

            } else {

                if (isExpandedPropertyHeader(property)) {

                    //  Expanded properties must be in the same location as expanded property header (now it is not in the array of the properties for showing)

                    propertyIndex = skipToPropertyFooter(properties, propertyIndex);
                    ++propertyIndex;

                }

            }


        } else if (tabAttributeValue == requiredTabValue) {

            //  If tab value is equal with required tab value this property must be in the array of the properties for showing

            if (isExpandedPropertyHeader(property)) {

                propertyIndex = addPropertiesToArrayWhileNotPropertyFooter(properties, propertyIndex, propertiesForShowing);
                propertiesForShowing.push(properties[propertyIndex]);

            } else {

                setPropertyColor(property, WCM_FORM_ROW_CLASSES[colorIndex]);
                colorIndex = increaseColorIndex(colorIndex);
                propertiesForShowing.push(properties[propertyIndex]);

            }

        } else {

            //  Expanded properties are skipped like expanded header property

            if (isExpandedPropertyHeader(property)) {

                propertyIndex = skipToPropertyFooter(properties, propertyIndex);
                ++propertyIndex;

            }

        }

    }
    return propertiesForShowing;

}





function addPropertiesToArrayWhileNotPropertyFooter (properties, currentPropertyIndex, array) {

    var property = properties[currentPropertyIndex];

    while (!isPropertyFooter(property)) {
        array.push(property);
        property = properties[++currentPropertyIndex];
    }

    return currentPropertyIndex;
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

    var tabsArea = getTabsArea();

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
        getPropertiesTable());
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
