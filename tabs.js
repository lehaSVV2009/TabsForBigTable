/**
 *  Id of element where tabs will be stored
 * @type {string}
 */
var TABS_AREA = 'tabsArea';

/**
 *  Id of element in which tables will stored
 * @type {string}
 */
var TABLES_AREA = 'tablesArea';

/**
 *  Id of element containing all properties
 * @type {string}
 */
var PROPERTIES_TABLE = 'propertiesTable';


/**
 *
 *  HTML ELEMENTS ATTRIBUTES
 *
 */

var TAB_ATTRIBUTE_NAME = 'tab';

var ID_ATTRIBUTE_NAME = 'id';

var ON_CLICK_IE_ATTRIBUTE_NAME = 'onclick';

var ON_CLICK_CHROME_ATTRIBUTE_NAME = 'click';

var ON_MOUSE_OVER_IE_ATTRIBUTE_NAME = 'onmouseover';

var ON_MOUSE_OVER_CHROME_ATTRIBUTE_NAME = 'mouseover';

var ON_MOUSE_OUT_IE_ATTRIBUTE_NAME = 'onmouseout';

var ON_MOUSE_OUT_CHROME_ATTRIBUTE_NAME = 'mouseout';

var CLASS_ATTRIBUTE_NAME = 'class';


/**
 *
 *  HTML TAGS
 *
 */

var TABLE_TAG = 'table';

var TBODY_TAG = 'tbody';

var TR_TAG = 'tr';

var TD_TAG = 'td';

var TH_TAG = 'th';

var DIV_TAG = 'div';

var SPAN_TAG = 'span';

var A_TAG = 'a';

var IMG_TAG = 'img';


/**
 *
 *  CLASSES FOR TABS
 *
 */
var TAB_CLASS_NAME = 'tab';

var TAB_AREA_CLASS_NAME = 'tabs';

var SELECTED_TAB_CLASS_NAME = 'tabSelected';

var TAB_TEXT_CLASS_NAME = 'tabText';

/**
 *
 *  ROW COLOR CLASS
 *
 */
var WCM_FORM_ROW_ODD_CLASS = 'wcmFormRowOdd';

var WCM_FORM_ROW_EVEN_CLASS = 'wcmFormRowEven';

var WCM_FORM_ROW_CLASSES = [
    WCM_FORM_ROW_ODD_CLASS,
    WCM_FORM_ROW_EVEN_CLASS
];


/**
 *
 *  WCM PROPERTY CLASSES
 *
 */

var WCM_FORM_MAIN_HEADER = 'wcmFormMainHeader';


/**
 *
 *  Needed numbers of elements
 *
 */

var EXPANDED_PROPERTY_HEADER_CHILDREN_NUMBER = 3;

var EXPANDED_PROPERTY_FOOTER_CHILDREN_NUMBER = 1;

var SYSTEM_PROPERTY_HEADER_TH_CHILDREN = 1;

var SYSTEM_PROPERTY_HEADER_A_CHILDREN = 2;

var SYSTEM_PROPERTY_HEADER_IMG_CHILDREN = 2;

var MINIMAL_NUMBER_OF_TABS_FOR_TABS_CREATING = 2;


/**
 *
 *  GET ELEMENTS FUNCTIONS
 *
 */



/**
 *  Get all <tr> elements from table
 *
 * @param table
 * @return {NodeList}
 */
function getAllTrsFromTable(table) {

    var tbody
        = table.getElementsByTagName(TBODY_TAG)[0];

    var trs
        = tbody.getElementsByTagName(TR_TAG);

    return trs;

}



/**
 *
 *  ATTRIBUTE FUNCTIONS
 *
 */



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
 *  Get array of not repeated attribute values from array of properties with defined attributeName
 *
 * @param properties        array of elements which may have
 * @param attributeName     name of attribute. Used to find values
 * @return {Array}          array of not repeated attribute values
 */
function findAttributeValuesSkippingExpandedProperties(properties, attributeName) {

    var attributeValues = new Array();

    for (var propertyIndex = 0; propertyIndex < properties.length; ++propertyIndex) {

        var property = properties[propertyIndex];
        if (isExpandedPropertyHeader(property) || isSystemPropertyHeader(property)) {

            propertyIndex = skipToPropertyFooter(properties, propertyIndex);
            ++propertyIndex;

        } else {

            var value = property.getAttribute(attributeName);
            if (value != null) {
                if (!attributeValues.contains(value)) {
                    attributeValues.push(value);
                }
            }

        }

    }

    return attributeValues;
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


/**
 *
 *  TABS
 *
 */



/**
 *  Create tabs and add to element with id = TABS_AREA as children
 *
 * @param tabNames      array of strings with tabs names
 */
function initTabs(tabNames) {

    var tabs = createTabs(tabNames);

    var tabsArea
        = document.getElementById(TABS_AREA);

    appendElements(tabs, tabsArea);

}



/**
 *  Create array of tab elements by tabNames
 *
 * @param tabNames      array of names of tabs which will created in this function
 */
function createTabs(tabNames) {

    var newTabs = new Array();

    for (var tabNameIndex = 0; tabNameIndex < tabNames.length; ++tabNameIndex) {

        var tabName = tabNames[tabNameIndex];

        var tab = createTab(
            tabNameIndex,
            tabName,
            new Function('chooseTab(' + tabNameIndex + ')'),
            new Function(),
            new Function()
        );

        newTabs.push(tab);
    }

    return newTabs;

}



/**
 *  Create simple tag that will be used as tab (reference to defined table)
 *
 * @param tabName               attribute name of tab
 * @param tabValue              attribute value (for output) of tab
 * @param onClickFunction       listener on click tab
 * @param mouseOverFunction     listener on mouse over tab
 * @param mouseOutFunction      listener on mouse out tab
 */
function createTab(tabName, tabValue, onClickFunction, mouseOverFunction, mouseOutFunction) {

    var tab = document.createElement(DIV_TAG);

    tab.name = tabName;
    tab.appendChild(
        createSpan(tabValue, TAB_TEXT_CLASS_NAME)
    );
    try {

        tab.attachEvent(ON_MOUSE_OUT_IE_ATTRIBUTE_NAME, mouseOutFunction);                       //For IE
        tab.attachEvent(ON_MOUSE_OVER_IE_ATTRIBUTE_NAME, mouseOverFunction);
        tab.attachEvent(ON_CLICK_IE_ATTRIBUTE_NAME, onClickFunction);

    } catch (e) {

        tab.addEventListener(ON_MOUSE_OUT_CHROME_ATTRIBUTE_NAME, mouseOutFunction, false);      //For Mozilla-based browsers
        tab.addEventListener(ON_MOUSE_OVER_CHROME_ATTRIBUTE_NAME, mouseOverFunction, false);
        tab.addEventListener(ON_CLICK_CHROME_ATTRIBUTE_NAME, onClickFunction, false);

    }

    return tab;
}



/**
 *  Create <span> element with defined inner text and defined value of attribute "className"
 *
 * @param innerText                 text that needs to be in span
 * @param classAttributeValue       value of attribute "className" that need to be in span
 * @return {HTMLElement}
 */
function createSpan (innerText, classAttributeValue) {

    var span = document.createElement(SPAN_TAG);

    span.innerText = innerText;
    span.className = classAttributeValue;

    return span;
}



/**
 *  Append array of elements to define prent as children
 *
 * @param elements      array of elements for appending
 * @param parent        element which will be parent to elements after this method
 */
function appendElements(elements, parent) {
    for (var elementIndex = 0; elementIndex < elements.length; ++elementIndex) {
        parent.appendChild(
            elements[elementIndex]
        );
    }
}



/**
 *
 *  TABLES
 *
 */



/**
 *  Create tables, append it to parentElement and remove old table by tabs names count
 *
 * @param tabNames      array of strings with tabs names
 */
function initTables(tabNames) {

    var propertiesTable
        = document.getElementById(PROPERTIES_TABLE);

    var properties
        = getAllTrsFromTable(propertiesTable);

    var newTables
        = createTables(tabNames, properties, TAB_ATTRIBUTE_NAME);

    appendElements(
        newTables,
        document.getElementById(TABLES_AREA)
    );

    removeElement(propertiesTable);
}



/**
 *  Create table with properties needed just in this tab that will be referenced by tab
 *
 * @param tabNames              array of names of tabs
 * @param properties            array of properties
 * @param tabAttributeName      attribute name of properties that defined how to allocate properties
 * @return {Array}              array of new tables with new properties which creation based on properties attribute and tabs
 */
function createTables(tabNames, properties, tabAttributeName) {

    var newTables = new Array();

    for (var tabIndex = 0, tabNamesLength = tabNames.length; tabIndex < tabNamesLength; ++tabIndex) {
        var newTable
            = createTable(tabNames[tabIndex], properties, tabAttributeName);
        newTables.push(newTable);
    }

    return newTables;

}



/**
 *  Create table with properties that are taken from all properties allocated by tabAttribute in this properties
 *  Realize by loop that goes over all properties. In loop if property hasn't attribute with tabAttributeName or has it with value == tabValue,
 *  clone of this property go to new table.
 *
 * @param requiredTabValue              string value of tab
 * @param properties            array of all properties
 * @param tabAttributeName      attribute name used to find tabAttributeValue
 * @return {HTMLElement}        new sub table with some cloned properties
 */
function createTable(requiredTabValue, properties, tabAttributeName) {

    var newTable
        = document.createElement(TABLE_TAG);
    newTable.setAttribute(ID_ATTRIBUTE_NAME, requiredTabValue);

    var newTBody
        = document.createElement(TBODY_TAG);

    var colorIndex = 0;

    for (var propertyIndex = 0; propertyIndex < properties.length; ++propertyIndex) {

        var property = properties[propertyIndex];
        var tabAttributeValue = property.getAttribute(tabAttributeName);

        if (tabAttributeValue == null) {

            if (isExpandedPropertyHeader(property) || isSystemPropertyHeader(property)) {

                propertyIndex
                    = appendPropertyWhileNotPropertyFooter(properties, propertyIndex, newTBody);
                appendCloneToElement(properties[propertyIndex], newTBody);

            } else {

                adjustPropertyColor(property, WCM_FORM_ROW_CLASSES[colorIndex]);
                colorIndex = increaseColorIndex(colorIndex);
                appendCloneToElement(property, newTBody);

            }

        } else if (tabAttributeValue == requiredTabValue) {

            if (isExpandedPropertyHeader(property)) {

                propertyIndex
                    = appendPropertyWhileNotPropertyFooter(properties, propertyIndex, newTBody);
                appendCloneToElement(properties[propertyIndex], newTBody);

            } else {

                adjustPropertyColor(property, WCM_FORM_ROW_CLASSES[colorIndex]);
                colorIndex = increaseColorIndex(colorIndex);
                appendCloneToElement(property, newTBody);

            }

        } else {

            if (isExpandedPropertyHeader(property)) {
                propertyIndex = skipToPropertyFooter(properties, propertyIndex);
                ++propertyIndex;
            }

        }
    }
    newTable.appendChild(newTBody);

    return newTable;
}


/**
 *  Append clone of element to defined element
 *
 * @param cloneable     element that used to be cloned
 * @param parent        element that used to be parent to element clone
 */
function appendCloneToElement (cloneable, parent) {

    var child = cloneable.cloneNode(true);
    parent.appendChild(child);

}




function increaseColorIndex (colorIndex) {

    ++colorIndex;

    if (colorIndex == WCM_FORM_ROW_CLASSES.length) {
        colorIndex = 0;
    }

    return colorIndex;
}



function appendPropertyWhileNotPropertyFooter (properties, currentPropertyIndex, parent) {

    var property = properties[currentPropertyIndex];

    while (!isPropertyFooter(property)) {
        appendCloneToElement(property, parent);
        property = properties[++currentPropertyIndex];
    }

    return currentPropertyIndex;
}



/**
 *  Check property on header
 *  If property has three <td> sub elements and all of this <td>-s have attribute WCM_FORM_MAIN_HEADER - it is an expanded property header
 *
 * @param property                  property for checking
 * @return {boolean}                true - if it is expanded property, false - if it is not
 */
function isExpandedPropertyHeader(property) {

    var trChildren = property.getElementsByTagName(TD_TAG);

    var isExpandedPropertyHeader = true;

    if (trChildren.length != EXPANDED_PROPERTY_HEADER_CHILDREN_NUMBER) {
        isExpandedPropertyHeader = false;
    } else {
        isExpandedPropertyHeader
            = checkElementsOnHavingClassNameAttributeValue(trChildren, WCM_FORM_MAIN_HEADER);
    }

    return isExpandedPropertyHeader;

}



/**
 *
 *  Check property on footer (end of expanded properties or system properties array)
 *  If property has one <td> sub element and this <td> has attribute WCM_FORM_MAIN_HEADER - it is a property footer
 *
 * @param property                  property for checking
 * @return {boolean}                true - if property is an expanded property footer, false - if is not
 */
function isPropertyFooter(property) {

    var trChildren = property.getElementsByTagName(TD_TAG);

    var isPropertyFooter = true;

    if (trChildren.length != EXPANDED_PROPERTY_FOOTER_CHILDREN_NUMBER) {
        isPropertyFooter = false;
    } else {
        isPropertyFooter
            = checkElementsOnHavingClassNameAttributeValue(trChildren, WCM_FORM_MAIN_HEADER);
    }

    return isPropertyFooter;

}



function isSystemPropertyHeader (property) {

    var trChildren = property.getElementsByTagName(TH_TAG);

    var isSystemProperty = true;

    if (trChildren.length != SYSTEM_PROPERTY_HEADER_TH_CHILDREN) {
        isSystemProperty = false;
    } else if (!checkElementsOnHavingClassNameAttributeValue(trChildren, WCM_FORM_MAIN_HEADER)) {
        isSystemProperty = false;
    } else {
        for (var childIndex = 0; childIndex < trChildren.length; ++childIndex) {
            if (!checkElementOnHavingDefinedChildren(trChildren[childIndex], A_TAG, SYSTEM_PROPERTY_HEADER_A_CHILDREN)
                || !checkElementOnHavingDefinedChildren(trChildren[childIndex], IMG_TAG, SYSTEM_PROPERTY_HEADER_IMG_CHILDREN)
            ) {
                isSystemProperty = false;
            }
        }
    }

    return isSystemProperty;
}




function isSystemPropertyFooter (property) {
    return isPropertyFooter(property);
}



/**
 *  Check array of elements on having attribute className with defined Value classNameAttributeValue
 *
 * @param elements                  elements for checking
 * @param classNameAttributeValue   needed value of attribute className
 * @return {boolean}                true - if all elements have attributes className with value == classNameAttributeValue, false - if not all
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



function checkElementOnHavingDefinedChildren (element, childTagName, childCount) {

    var elementHasSuchChildren = true;

    var children = element.getElementsByTagName(childTagName);

    if (children.length != childCount) {
        elementHasSuchChildren = false;
    }

    return elementHasSuchChildren;
}


/**
 *  Adjust color of all sub elements of property
 *
 * @param property                          element with sub elements that contains className
 * @param colorAttributeValue               value of class that change color of sub element
 */
function adjustPropertyColor(property, colorAttributeValue) {

    var tdElements
        = property.getElementsByTagName(TD_TAG);

    for (var tdIndex = 0; tdIndex < tdElements.length; ++tdIndex) {
        tdElements[tdIndex].className = colorAttributeValue;
    }

}



/**
 *  Completely remove any dom element from page
 *
 * @param element       element for removing
 */
function removeElement(element) {

    element.outerHTML = "";
    delete element;

}



/**
 *
 *  TAB ONCLICK LISTENER
 *
 */



/**
 *  Event that may be called by click on tab
 *  Hide unneeded tables and show just required table
 *
 * @param tabIndex      index of tab (0, 1, ...)
 */
function chooseTab(tabIndex) {

    var tablesArea
        = document.getElementById(TABLES_AREA);
    var tables
        = tablesArea.getElementsByTagName(TABLE_TAG);

    for (var tableIndex = 0; tableIndex < tables.length; ++tableIndex) {
        setVisibilityOfElement(tables[tableIndex], tableIndex == tabIndex);
    }

    changeTab(tabIndex);

}



/**
 *  Change color of pressed tab and of other tabs
 *
 * @param pressedTabIndex       index of pressed tab (0, 1, ...)
 */
function changeTab (pressedTabIndex) {

    var tabsArea 
            = document.getElementById(TABS_AREA);
    
    var tabs = tabsArea.getElementsByTagName(DIV_TAG);

    for (var tabIndex = 0; tabIndex < tabs.length; ++tabIndex) {
        tabs[tabIndex].className = TAB_CLASS_NAME;
    }

    tabs[pressedTabIndex].className = TAB_CLASS_NAME + ' ' + SELECTED_TAB_CLASS_NAME;
}



/**
 *  Set visibility of element in page
 *
 * @param element       element to setting visibility
 * @param visibility    false - to hide element, true - to show
 */
function setVisibilityOfElement(element, visibility) {

    element.style.display = visibility ? '' : 'none';

}




window.onload = function () {

    var propertiesTable
        = document.getElementById(PROPERTIES_TABLE);

    var values = findAttributeValuesSkippingExpandedProperties(
        getAllTrsFromTable(propertiesTable),
        TAB_ATTRIBUTE_NAME
    );

    if (values.length >= MINIMAL_NUMBER_OF_TABS_FOR_TABS_CREATING) {

        initTabs(values);

        initTables(values);

        chooseTab(0);
    }

}