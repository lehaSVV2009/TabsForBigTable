/**
 *  Id of element where tabs will be stored
 * @type {string}
 */
var TABS_AREA = 'tabs';

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

var LI_TAG = 'input';


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
 *  GET ELEMENTS FUNCTIONS
 *
 */




/**
 *  Get all <tr> elements from table
 *
 * @param table
 * @return {NodeList}
 */
function getAllTrsFromTable (table) {

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
function findAttributeValues(properties, attributeName) {

    var attributeValues = new Array();

    for (var propertyIndex = 0; propertyIndex < properties.length; ++propertyIndex) {

        var value = properties[propertyIndex].getAttribute(attributeName);
        if (value != null) {
            if (!attributeValues.contains(value)) {
                attributeValues.push(value);
            }
        }

    }

    return attributeValues;
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
function initTabs (tabNames) {

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
 *  Create simple tag <li> that will be used as tab (reference to defined table)
 *
 * @param tabName               attribute name of tab
 * @param tabValue              attribute value (for output) of tab
 * @param onClickFunction       listener on click tab
 * @param mouseOverFunction     listener on mouse over tab
 * @param mouseOutFunction      listener on mouse out tab
 */
function createTab (tabName, tabValue, onClickFunction, mouseOverFunction, mouseOutFunction) {

    var tab = document.createElement(LI_TAG);

    tab.type = 'button';
    tab.name = tabName;
    tab.value = tabValue;
    try {

        tab.attachEvent(ON_MOUSE_OUT_IE_ATTRIBUTE_NAME, mouseOutFunction);                       //For IE
        tab.attachEvent(ON_MOUSE_OVER_IE_ATTRIBUTE_NAME, mouseOverFunction);
        tab.attachEvent(ON_CLICK_IE_ATTRIBUTE_NAME, onClickFunction);

    } catch(e) {

        tab.addEventListener(ON_MOUSE_OUT_CHROME_ATTRIBUTE_NAME, mouseOutFunction, false);      //For Mozilla-based browsers
        tab.addEventListener(ON_MOUSE_OVER_CHROME_ATTRIBUTE_NAME, mouseOverFunction, false);
        tab.addEventListener(ON_CLICK_CHROME_ATTRIBUTE_NAME, onClickFunction, false);

    }

    return tab;
}



/**
 *  Append array of elements to define prent as children
 *
 * @param elements      array of elements for appending
 * @param parent        element which will be parent to elements after this method
 */
function appendElements (elements, parent) {
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
function initTables (tabNames) {

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
function createTables (tabNames, properties, tabAttributeName) {

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
 * @param tabValue              string value of tab
 * @param properties            array of all properties
 * @param tabAttributeName      attribute name used to find tabAttributeValue
 * @return {HTMLElement}        new sub table with some cloned properties
 */
function createTable (tabValue, properties, tabAttributeName) {

    var newTable
            = document.createElement(TABLE_TAG);
    newTable.setAttribute(ID_ATTRIBUTE_NAME, tabValue);

    var newTBody
            = document.createElement(TBODY_TAG);

    var color = 0;

    for (var propertyIndex = 0; propertyIndex < properties.length; ++propertyIndex) {

        var property = properties[propertyIndex];
        var tabAttributeValue = property.getAttribute(tabAttributeName);
        if (tabAttributeValue == null
            || tabAttributeValue == tabValue) {

            var cloneProperty = property.cloneNode(true);

            if (tabAttributeValue == tabAttributeValue) {
                adjustPropertyColor(cloneProperty, WCM_FORM_ROW_CLASSES[color]);
                ++color;
                if (color == WCM_FORM_ROW_CLASSES.length) {
                    color = 0;
                }
            }

            newTBody.appendChild(cloneProperty);

        }

    }
    newTable.appendChild(newTBody);

    return newTable;
}



/**
 *  Adjust color of all sub elements of property
 *
 * @param property                          element with sub elements that contains className
 * @param colorAttributeValue               value of class that change color of sub element
 */
function adjustPropertyColor (property, colorAttributeValue) {

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
function chooseTab (tabIndex) {

    var tablesArea
            = document.getElementById(TABLES_AREA);
    var tables
            = tablesArea.getElementsByTagName(TABLE_TAG);

    for (var tableIndex = 0; tableIndex < tables.length; ++tableIndex) {
        setVisibilityOfElement(tables[tableIndex], tableIndex == tabIndex);
    }

}



/**
 *  Set visibility of element in page
 *
 * @param element       element to setting visibility
 * @param visibility    false - to hide element, true - to show
 */
function setVisibilityOfElement (element, visibility) {

    element.style.display = visibility ? '' : 'none';

}







window.onload = function () {

    var propertiesTable
        = document.getElementById(PROPERTIES_TABLE);

    var values = findAttributeValues(
        getAllTrsFromTable(propertiesTable),
        TAB_ATTRIBUTE_NAME
    );

    if (values.length != 0) {

        initTabs(values);

        initTables(values);

        chooseTab(0);
    }

}