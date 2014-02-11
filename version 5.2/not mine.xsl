<?xml version="1.0" encoding="UTF-8"?>
<!-- (c) Copyright IBM Corp. 2002, 2009.  All Rights Reserved. -->
<!--
$Workfile:   WcmPropertiesInfoPage.xsl  $
$Revision:   1.276  $
$Date:   Aug 26 2009 15:41:04  $
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:java="http://xml.apache.org/xslt/java"
    xmlns:wcm="http://filenet.com/namespaces/wcm/apps/1.0"
    exclude-result-prefixes="java wcm" version="1.0">

    <xsl:output method="html" encoding="UTF-8" omit-xml-declaration="yes" indent="yes"/>

    <!-- configurable parameters -->
    <xsl:param name="clientLocale" />
    <xsl:param name="output"/>
    <xsl:param name="locale"/>
    <xsl:param name="cvlSize" select="1000"/>
    <xsl:param name="readonly" select="$output/wcm:response/wcm:objectset/*/wcm:classdesc/wcm:allowinst=0"/>
    <xsl:param name="formName"/>
    <xsl:param name="objectType"/>
    <xsl:param name="multiValueSelectPage"/>
    <xsl:param name="choiceNavigationPage"/>
    <xsl:param name="multiValueDataInputPage"/>
    <xsl:param name="multiValueHierSelectPage"/>
    <xsl:param name="addToWebPage"/>
    <xsl:param name="currentPageURL"/>
    <xsl:param name="rawWindowId"/>
    <xsl:param name="windowId" select="''"/>
    <xsl:param name="showInfoLink" select="true()"/>
    <xsl:param name="isCheckin" select="0"/>
    <xsl:param name="isCreate" select="0"/>
    <xsl:param name="eventURL"/>
    <xsl:param name="expandedPropID"/>
    <xsl:param name="expandedProperties"/>
    <xsl:param name="expandedPropdescs"/>
    <xsl:param name="promoteAsMajorVersion" select="false()"/>
    <xsl:param name="rightToPromote" select="true()"/>
    <xsl:param name="showPromote" select="true()"/>
    <xsl:param name="showDefaults" select="true()"/>
    <xsl:param name="singleProperty"/>
    <xsl:param name="filterProperty" select="'Pleasenobodymakeasymnamelikethis'"/>
    <xsl:param name="filterProperty2" select="'Pleasenobodymakeasymnamelikethis'"/>
    <xsl:param name="printViewURL"/>
    <xsl:param name="printViewIcon"/>
    <xsl:param name="printViewCommand"/>
    <xsl:param name="propertyToRename"/>
    <xsl:param name="renamePropertyTo" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.renamePropertyTo', 'Link To')"/>
    <xsl:param name="rmProperties"/>
    <xsl:param name="rmPropDescs"/>
    <xsl:param name="dateFormat"/>
    <xsl:param name="timeFormat"/>
    <xsl:param name="timeZone"/>
    <xsl:param name="dateTimeControlSettings" />
    <xsl:param name="userAccess"/>
    <xsl:param name="noContentAccess" />
    <xsl:param name="baseUrlPath" />
    <xsl:param name="className" select="''"/>
    <xsl:param name="recordClassName" select="''"/>
    <xsl:param name="filterObjectType" select="'subscribedevent'" />
    <xsl:param name="showSelectClassLink" select="0"/>
    <xsl:param name="rootClassId"/>
    <xsl:param name="lockSelectClassOS" select="true()"/>
    <xsl:param name="includedClasses"/>
    <xsl:param name="propertyExceptions" />
    <xsl:param name="showSystemProperties"/>
    <xsl:param name="expandSystemProperties" select="'true'"/>
    <xsl:param name="filteredPropDescs"/>
    <xsl:param name="referenceObjectClassId" select="''"/>
    <xsl:param name="multiObjects"/>


    <!-- lifecycle params -->
    <xsl:param name="showLifecycle" select="false()"/>
    <xsl:param name="exceptionState" select="'No'"/>
    <xsl:param name="lifecycleState" select="'lifeCycleState'"/>
    <xsl:param name="showApply" select="false()"/>
    <xsl:param name="clearExceptionString"/>
    <xsl:param name="clearExceptionValue"/>
    <xsl:param name="demoteString"/>
    <xsl:param name="demoteValue"/>
    <xsl:param name="resetString"/>
    <xsl:param name="resetValue"/>
    <xsl:param name="promoteString"/>
    <xsl:param name="promoteValue"/>
    <xsl:param name="currentValue"/>
    <xsl:param name="setExceptionString"/>
    <xsl:param name="setExceptionValue"/>
    <xsl:variable name="wsLifecycle" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmGeneralPropsInfoPage_xsl.LifecycleLabel', 'Life Cycle State')"/>
    <xsl:variable name="lifeCycleText" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmGeneralPropsInfoPage_xsl.lifeCycleText', 'Life Cycle')"/>

    <xsl:param name="releaseText"/>
    <xsl:param name="inProcessText"/>
    <xsl:param name="reservationText"/>
    <xsl:param name="supercededText"/>
	<xsl:param name="onApprovalDate"/>
    <xsl:param name="showCD" select="false()"/>
    <xsl:param name="canChangeCDState" select="true()"/>
    <xsl:param name="canEditCD" select="true()"/>
    <xsl:param name="addChildLabel" />

    <xsl:param name="compoundDocumentState" />
    <xsl:param name="releaseDateSymName" select="'WcmReleaseDate'"/>

    <!-- localizable strings -->
    <xsl:variable name="property" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.property', 'Property')"/>
    <xsl:variable name="value" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.value', 'Value')"/>
   <xsl:variable name="multiObjectsIndicator" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.multiObjectsIndicator', 'Open list to view the values')"/>

    <!-- configurable labeling for term "Class" -->
    <xsl:param    name="class" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.class', '{0}: ',
                                       java:com.filenet.wcm.apps.server.util.prefs.LabelConfiguration.getConfiguredLabelResource('Class', $clientLocale) )"/>
    <xsl:variable name="wsRecordClass" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.recordClass', 'Record {0}:',
                                               java:com.filenet.wcm.apps.server.util.prefs.LabelConfiguration.getConfiguredLabelResource('Class', $clientLocale) )"/>
    <xsl:variable name="objectClass" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.objectClass', 'Object {0}: ',
                                             java:com.filenet.wcm.apps.server.util.prefs.LabelConfiguration.getConfiguredLabelResource('Class', $clientLocale) )"/>
    <xsl:variable name="requiredClass" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.requiredClass', 'Required {0}',
                                               java:com.filenet.wcm.apps.server.util.prefs.LabelConfiguration.getConfiguredLabelResource('Class', $clientLocale) )"/>
    <xsl:variable name="wsChangeClass" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.changeClass', 'Change {0}',
                                               java:com.filenet.wcm.apps.server.util.prefs.LabelConfiguration.getConfiguredLabelResource('Class', $clientLocale) )"/>
    <xsl:variable name="wsChildren" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.children', '{0}: ',
                                       java:com.filenet.wcm.apps.server.util.prefs.LabelConfiguration.getConfiguredLabelResource('Children', $clientLocale) )"/>
    <!-- end configurable labeling -->
                 
    
<!-- =>IBA -->
	
	<xsl:variable name="noDocAccessText"
		select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.noDocAccess', 'You have no acces to the document of this case.')" />
	<xsl:variable name="noDocAccessLink"
		select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.noDocAccessLink', 'Reqeust the access')" />

	
    <xsl:variable name="objectSymname" 
    	select="$allPropDescs[wcm:symname='This']/wcm:reqclass/wcm:symname" />
    	
<!-- <=IBA -->

    <xsl:variable name="readOnlyText" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.readonly', '(readonly)')"/>
    <xsl:variable name="multiSeparator" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.multiseparator', '; ')"/>
    <xsl:variable name="noObjectSet" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.noObject', 'No Object(s) Set')"/>
    <xsl:variable name="valueNotDefined" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.valueNotDefined', 'Value Not Defined.')"/>
    <xsl:variable name="options" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.options', 'Options')"/>
    <xsl:variable name="addMajorVer" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.addMajorVer', 'Add as {0}',
                                               java:com.filenet.wcm.apps.server.util.prefs.LabelConfiguration.getConfiguredLabelResource('MajorVersion', $clientLocale) )"/>
    <xsl:variable name="chkinMajorVer" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.checkinMajorVer', 'Check in as {0}',
                                               java:com.filenet.wcm.apps.server.util.prefs.LabelConfiguration.getConfiguredLabelResource('MajorVersion', $clientLocale) )"/>
    <xsl:variable name="yes" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.yes', 'Yes')"/>
    <xsl:variable name="no" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.no', 'No')"/>
    <xsl:variable name="multiValue" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.multiValue', 'Multi-value:')"/>
    <xsl:variable name="useDefaultsLabel" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.useDefaultsLabel', 'Use Defaults')"/>
    <xsl:variable name="userDefinedLabel" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.userDefinedLabel', 'User Defined')"/>
    <xsl:variable name="wsLinkTo" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.linkTo', 'Link To')"/>
    <xsl:variable name="wsSelectValue" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.selectValue', 'Select Value')"/>
    <xsl:variable name="wsChangeValue" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.changeValue', 'Change Value')"/>
    <xsl:variable name="wsClear" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.clear', 'Clear')"/>

    <xsl:variable name="promoteAsMajorVersionText" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.promoteAsMajorVersionText', 'Promote As Major Version')"/>
    <xsl:variable name="requiredText" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.requiredText', 'Required')"/>
    <xsl:variable name="markingText" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.markingText', 'Marking')"/>
    <xsl:variable name="requiredMarkingText" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.requiredMarkingText', 'Required Marking')"/>
    <xsl:variable name="expandObjectProperties" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.expandObjectProperties', 'Expand Object Properties')"/>
    <xsl:variable name="collapseObjectProperties" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.collapseObjectProperties', 'Collapse Object Properties')"/>
    <xsl:variable name="wsGetInfoFor" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.getInfoFor', 'Get info for {0}')"/>
    <xsl:variable name="wsSelectObject" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.selectObject', 'Select Object')"/>
    <xsl:variable name="systemProperties" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.systemProperties', 'System Properties')"/>
    <xsl:variable name="hideSystemPropertiesText" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.hideSystemPropertiesText', 'Hide System Properties')"/>
    <xsl:variable name="showSystemPropertiesText" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.showSystemPropertiesText', 'Show System Properties')"/>
	<xsl:variable name="onApproval" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.onApproval', 'On Approval')"/>
    <xsl:variable name="wsCompoundDocumentHeader" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.compoundDocumentHeader', 'Compound Document')"/>
    <xsl:variable name="wsCompoundDocument" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.compoundDocument', 'Compound Document:')"/>
    <xsl:variable name="wsShow" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.show', 'Show')"/>
    <xsl:variable name="wsUseArrowKeys" select="java:com.filenet.wcm.toolkit.util.WcmString.new($clientLocale, 'server.WcmPropertiesInfoPageXSL.useArrowKeys', 'Use up and down arrows to change the selection')"/>

    <xsl:variable name="encodedObjectStoreName">
        <xsl:if test="$output">
            <xsl:value-of select="java:com.filenet.wcm.toolkit.util.WcmEncodingUtil.encodeLabel(string($output/wcm:response/wcm:objectset/*/wcm:objectstore/wcm:name))"/>
        </xsl:if>
    </xsl:variable>

    <xsl:variable name="allPropDescs" select="wcm:response/wcm:objectset/wcm:objectstore/wcm:classdesc/wcm:propdescs/wcm:propdesc"/>
    <xsl:variable name="propDescs" select="$allPropDescs[wcm:ishidden!=1][wcm:issysowned=0 or (wcm:isreadonly!=1 and wcm:setability!=3)][wcm:datatype!=1]"/>
    <xsl:variable name="classPropDescs" select="$propDescs[wcm:symname!='ITXFormTemplate' and wcm:symname!='FormPolicy' and wcm:symname!='MimeType' and wcm:symname!='SourceDocument' and wcm:symname!='RecordInformation' and wcm:symname!='DestinationDocuments' and wcm:symname!='CompoundDocumentState']"/>
    <xsl:include href="/WEB-INF/xsl/include/WcmProperty.xsl"/>
    <xsl:include href="/WEB-INF/xsl/include/WcmGetFormattedValue.xsl"/>
    <xsl:include href="/WEB-INF/xsl/include/PropertyInfo.xsl"/>

    <!--++++++++++++++++++++++++++++++++++ Main Template ++++++++++++++++++++++++++++++++++-->
    <xsl:template match="/">
        <xsl:if test="$output or $readonly">
            <xsl:call-template name="displayClassName"/>
            
            <xsl:choose>
                <xsl:when test="$singleProperty">
                    <!-- Table header -->
                    <xsl:call-template name="propertyHeader">
                        <xsl:with-param name="className" select="$allPropDescs[wcm:symname=$singleProperty]/wcm:reqclass/wcm:dispname"/>
                        <xsl:with-param name="isReadOnly" select="$readonly"/>
                    </xsl:call-template>

                    <xsl:call-template name="propertyLoop">
                        <xsl:with-param name="propdescs" select="$allPropDescs[wcm:symname=$singleProperty]"/>
                        <xsl:with-param name="theProperties" select="$output"/>
                        <xsl:with-param name="isReadOnly" select="$readonly"/>
                    </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                    <!-- Table header -->
                    <xsl:choose>
                        <xsl:when test="$output">
                            <xsl:call-template name="propertyHeader">
                                <xsl:with-param name="className" select="$output/wcm:response/wcm:objectset/*/wcm:classdesc/wcm:name"/>
                                <xsl:with-param name="isReadOnly" select="$readonly"/>
                            </xsl:call-template>
                            <xsl:call-template name="propertyLoop">
                                <xsl:with-param name="propdescs" select="$classPropDescs"/>
                                <xsl:with-param name="theProperties" select="$output"/>
                                <xsl:with-param name="isReadOnly" select="$readonly"/>
                            </xsl:call-template>

                            <xsl:call-template name="lifecycleField">
                            </xsl:call-template>
                            <!-- system properties -->
                            <xsl:if test="$showSystemProperties">
                                <xsl:call-template name="systemPropertiesHeader"/>
                                <xsl:if test="$expandSystemProperties='false'">
                                    <xsl:call-template name="propertyLoop">
                                        <xsl:with-param name="propdescs" select="$filteredPropDescs/wcm:response/wcm:objectset/wcm:objectstore/wcm:classdesc/wcm:propdescs//wcm:propdesc"/>
                                        <xsl:with-param name="theProperties" select="$output"/>
                                        <xsl:with-param name="isReadOnly" select="true()"/>
                                        <xsl:with-param name="isSystemProps" select="true()"/>
                                    </xsl:call-template>
                                </xsl:if>
                            </xsl:if>

                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:call-template name="propertyHeader">
                                <xsl:with-param name="isReadOnly" select="$readonly"/>
                            </xsl:call-template>
                            <xsl:call-template name="propertyLoop">
                                <xsl:with-param name="propdescs" select="$propDescs"/>
                                <xsl:with-param name="isReadOnly" select="$readonly"/>
                            </xsl:call-template>
                        </xsl:otherwise>
                    </xsl:choose>

                    <!-- Records Manage Properties -->
                    <xsl:choose>
                        <xsl:when test="$rmProperties">
                            <!-- header row -->
                            <tr>
                                <td colspan="3">
                                    <img alt="" src="images/web/common/Spacer.gif" width="1" height="6"/>
                                </td>
                            </tr>

                            <tr>
                                <td class="wcmPathText" colspan="3">
                                    <span class="wcmPathLabel">
                                        <xsl:value-of select="$wsRecordClass"/>&#160;
                                    </span>
                                    <span class="wcmPathLinkEnd">
                                        <xsl:value-of select="$recordClassName"/>
                                    </span>
                                </td>
                            </tr>

                            <xsl:call-template name="propertyHeader">
                                <xsl:with-param name="className" select="Email"/>
                                <xsl:with-param name="isReadOnly" select="$readonly"/>
                            </xsl:call-template>
                            <xsl:call-template name="propertyLoop">
                                <xsl:with-param name="propdescs" select="$rmPropDescs/wcm:response/wcm:objectset/wcm:objectstore/wcm:classdesc/wcm:propdescs//wcm:propdesc[wcm:ishidden!=1][wcm:issysowned=0 or (wcm:isreadonly!=1 and wcm:setability!=3)][wcm:datatype!=1]"/>
                                <xsl:with-param name="theProperties" select="$rmProperties"/>
                                <xsl:with-param name="isReadOnly" select="$readonly"/>
                                <xsl:with-param name="recordsManageValue" select="true()"/>
                            </xsl:call-template>
                        </xsl:when>
                    </xsl:choose>

                     <!-- Compound Document section  -->
                    <xsl:if test="$showCD=true()">
                        <xsl:call-template name="cdSection"/>
                    </xsl:if>
                    <!-- Promote Verion Combo box -->
                    <xsl:if test="$showPromote=true()">
                        <xsl:if test="(($isCheckin=1 or $isCreate=1) and $objectType='document') and $readonly=false()">
                            <xsl:call-template name="optionSection"/>
                        </xsl:if>
                    </xsl:if>

                    <xsl:call-template name="bottomSeparator"/>
                </xsl:otherwise>
            </xsl:choose>
            

        </xsl:if>
    </xsl:template>

    <!--++++++++++++++++++++++++++++++++++ System Properties Header Template ++++++++++++++++++++++++++++++++++-->
    <xsl:template name="systemPropertiesHeader">
        <tr>
            <th align="left" class="wcmFormMainHeader" width="1%" colspan='3'>
                <xsl:choose>
                    <xsl:when test="$expandSystemProperties='true'">
                        <xsl:choose>
                            <xsl:when test="string-length($formName)>0">
                                <a href="javascript:document.forms.{$formName}.action='{$eventURL}&amp;eventName=SystemProperties&amp;showSystemProperties=1';document.forms.{$formName}.submit()">
                                    <img width="16" height="16" border="0" src="images/action/ShowContents16.gif" title="{$showSystemPropertiesText}"/>
                                </a>
                                <img height="16" width="6" title="" src="images/state/None16.gif"/>
                                <a class="wcmListViewActionLink" href="javascript:document.forms.{$formName}.action='{$eventURL}&amp;eventName=SystemProperties&amp;showSystemProperties=1';document.forms.{$formName}.submit()">
                                    <xsl:value-of select="$showSystemPropertiesText"/>
                                </a>
                            </xsl:when>
                            <xsl:otherwise>
                                <a href="{$eventURL}&amp;eventName=SystemProperties&amp;showSystemProperties=1">
                                    <img width="16" height="16" border="0" src="images/action/ShowContents16.gif" title="{$showSystemPropertiesText}"/>
                                </a>
                                <img height="16" width="6" title="" src="images/state/None16.gif"/>
                                <a class="wcmListViewActionLink" href="{$eventURL}&amp;eventName=SystemProperties&amp;showSystemProperties=1">
                                    <xsl:value-of select="$showSystemPropertiesText"/>
                                </a>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:choose>
                            <xsl:when test="string-length($formName)>0">
                                <a href="javascript:document.forms.{$formName}.action='{$eventURL}&amp;eventName=SystemProperties&amp;showSystemProperties=0';document.forms.{$formName}.submit()">
                                    <img width="16" height="16" border="0" src="images/action/HideContents16.gif" title="{$hideSystemPropertiesText}"/>
                                </a>
                                <img height="16" width="6" title="" src="images/state/None16.gif"/>
                                <a class="wcmListViewActionLink" href="javascript:document.forms.{$formName}.action='{$eventURL}&amp;eventName=SystemProperties&amp;showSystemProperties=0';document.forms.{$formName}.submit()">
                                    <xsl:value-of select="$hideSystemPropertiesText"/>
                                </a>
                            </xsl:when>
                            <xsl:otherwise>
                                <a href="{$eventURL}&amp;eventName=SystemProperties&amp;showSystemProperties=0">
                                    <img width="16" height="16" border="0" src="images/action/HideContents16.gif" title="{$hideSystemPropertiesText}"/>
                                </a>
                                <img height="16" width="6" title="" src="images/state/None16.gif"/>
                                <a class="wcmListViewActionLink" href="{$eventURL}&amp;eventName=SystemProperties&amp;showSystemProperties=0">
                                    <xsl:value-of select="$hideSystemPropertiesText"/>
                                </a>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:otherwise>
                </xsl:choose>
            </th>
        </tr>

    </xsl:template>

    <!--++++++++++++++++++++++++++++++++++ Property Header Template ++++++++++++++++++++++++++++++++++-->
    <xsl:template name="propertyHeader">
        <xsl:param name="className"/>
        <xsl:param name="isReadOnly"/>

        <xsl:choose>
            <xsl:when test="$isCheckin=0 and $isCreate=0 and $objectType!='securitypolicy'">
                <tr>
                    <td colspan="3">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <!-- =>IBA -->
							<xsl:if test="$objectType='document' and $noContentAccess"> 
								<tr>
									<td>
										<span style="color:red;font-size: 10pt;">
											<xsl:value-of select="$noDocAccessText" />&#160;<a href="#" target="_blank" style="color:red; text-decoration:underline;font-size: 10pt;">
					                            <xsl:attribute name="onclick">
					                                <xsl:text>createNewWindow('</xsl:text>
					                                <xsl:value-of select="$baseUrlPath"></xsl:value-of>
					                                <xsl:text>/custom/CreateUserRequest.jsp?</xsl:text>
					                                <xsl:text>&amp;objectStoreName=</xsl:text>
					                                <xsl:value-of select="$encodedObjectStoreName" />
													<xsl:text>&amp;label=</xsl:text>
													<xsl:value-of select="$output/wcm:response/wcm:objectset/*/wcm:classdesc/wcm:label" />
													<xsl:text>&amp;id=</xsl:text>
					                                <xsl:value-of select="$output/wcm:response/wcm:objectset/*/wcm:id" />
					                                <xsl:text>&amp;objectType=</xsl:text>
					                                <xsl:value-of select="$objectType" />
					                                <xsl:text>&amp;classId=</xsl:text>
					                               	<xsl:value-of select="$output/wcm:response/wcm:objectset/*/wcm:classdesc/wcm:id" />				                                
					                                <xsl:text>&amp;requestType=1&amp;windowIdMode=CREATE_POPUP</xsl:text>
					                                <xsl:text>', 'window_permissionRequest', 'no', 'no', 'yes', 'yes',  700, 450, 'center', 'middle', 'yes'); return false;</xsl:text>
					                            </xsl:attribute>
					                           	<xsl:value-of select="$noDocAccessLink" />
					                        </a>
										</span>
									</td>
								</tr>
							 </xsl:if> 
						<!-- <=IBA -->
                            <tr>
                                <td class="wcmFormText">
                                    <xsl:choose>
                                        <xsl:when test="$singleProperty">
                                            <span class="wcmPathLabel">
                                                <xsl:value-of select="$objectClass"/>&#160;
                                            </span>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <span class="wcmPathLabel">
                                                <xsl:value-of select="$class"/>&#160;
                                            </span>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                    <span class="wcmPathLabelEnd">
                                        <i>
                                            <xsl:value-of select="$className"/>
                                        </i>
                                        <xsl:if test="$isReadOnly">&#160;
                                            <i>
                                                <xsl:value-of select="$readOnlyText"/>
                                            </i>
                                        </xsl:if>&#160;
                                    </span>
                                </td>
                                <!-- Printer Friendly View link -->
                                <xsl:if test="$printViewURL">
                                    <xsl:variable name="newPrintViewURL">
                                        <xsl:choose>
                                            <xsl:when test="$expandSystemProperties='true'">
                                                <xsl:value-of select="concat($printViewURL, '&amp;expandSystemProps=true')"/>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <xsl:value-of select="concat($printViewURL, '&amp;expandSystemProps=false')"/>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </xsl:variable>
                                    <td align="right" width="1%" nowrap="true">
                                        <a target="_blank" href="{$newPrintViewURL}">
                                            <img width="16" height="16" border="0" src="{$printViewIcon}" title="{$printViewCommand}"/>
                                        </a>
                                        <img height="16" width="6" title="" src="images/state/None16.gif"/>
                                        <a class="wcmListViewLink" target="_blank" href="{$newPrintViewURL}">
                                            <xsl:value-of select="$printViewCommand"/>&#160;
                                        </a>
                                    </td>
                                </xsl:if>
                            </tr>
                        </table>
                    </td>
                </tr>
            </xsl:when>
        </xsl:choose>

        <!-- header row -->
        <tr>
            <th class="wcmFormMainHeader" width="1%">
                <img alt="" src="images/web/common/Spacer.gif" width="16" height="16"/>
            </th>
            <th align="left" class="wcmFormMainHeader">
                <xsl:value-of select="$property"/>
            </th>
            <th align="left" class="wcmFormMainHeader">
                <xsl:value-of select="$value"/>
            </th>
        </tr>

    </xsl:template>

    <!--+++++++++++++++++++++++++++++++ Object Property Header Template ++++++++++++++++++++++++++++++++-->
    <xsl:template name="objectPropertyHeader">
        <xsl:param name="title"/>
        <xsl:param name="className"/>
        <xsl:param name="isReadOnly"/>

        <tr>
            <td colspan="3">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="left" class="wcmFormMainHeader">
                            <xsl:call-template name="getNormalizedValue">
                                <xsl:with-param name="propertyValue" select="$title"/>
                            </xsl:call-template>
                        </td>
                        <td align="right" class="wcmFormMainHeader">
                            <xsl:text>&#160;</xsl:text>
                            <xsl:value-of select="$class"/>
                            <b>
                                <xsl:value-of select="$className"/>
                            </b>
                            <xsl:if test="$isReadOnly">&#160;
                                <xsl:value-of select="$readOnlyText"/>
                            </xsl:if>&#160;
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </xsl:template>

    <!--++++++++++++++++++++++++++++++++++ Options Header Template ++++++++++++++++++++++++++++++++++-->
    <xsl:template name="optionHeader">
        <xsl:param name="columnHeader" select="$options"/>
        <!-- header row -->
        <tr>
            <th class="wcmFormMainHeader" width="1%">
                <img alt="" src="images/web/common/Spacer.gif" width="16" height="16"/>
            </th>
            <th align="left" class="wcmFormMainHeader">
                <xsl:value-of select="$columnHeader"/>
            </th>
            <th align="left" class="wcmFormMainHeader">&#160;</th>
        </tr>
    </xsl:template>

    <!--++++++++++++++++++++++++++++++++++ Property Loop Template ++++++++++++++++++++++++++++++++++-->
    <xsl:template name="propertyLoop">
        <xsl:param name="propdescs"/>
        <xsl:param name="theProperties" select="nothing"/>
        <xsl:param name="isReadOnly" select="false()"/>
        <xsl:param name="showIndented" select="false()"/>
        <xsl:param name="recordsManageValue" select="false()"/>
        <xsl:param name="isSystemProps"/>

        <!-- filter out unwanted properties -->
        <xsl:variable name="newPropDescs" select="$propdescs[wcm:symname!='SecurityTemplates' and wcm:symname!=$filterProperty and wcm:symname!=$filterProperty2]"/>

        <xsl:variable name="propertyNode" select="$theProperties/wcm:response/wcm:objectset/*/wcm:properties/wcm:property"/>
        <xsl:for-each select="$newPropDescs">
            <!-- Set For Loop Variables -->
            <xsl:variable name="NAME" select="wcm:symname"/>
            <xsl:variable name="theProperty" select="$propertyNode[wcm:symname=$NAME]"/>
            <xsl:variable name="VALUE" select="$theProperty/wcm:value"/>

            <!-- 1 if readonly, otherwise 0 -->
            <xsl:variable name="checkReadOnly">
                <xsl:choose>
                    <xsl:when test="$isReadOnly">
                        <xsl:value-of select="1"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="isReadOnly" >
                            <xsl:with-param name="theProperties" select="$theProperties"/>
                            <xsl:with-param name="theProperty" select="$theProperty"/>
                            <xsl:with-param name="relax" select="$recordsManageValue != null"/>                            
                        </xsl:call-template>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:variable>

            <!-- set newValue: either comma separated multi-value, single value, or the default propdef -->
            <xsl:variable name="newValue">
                <xsl:choose>
                    <xsl:when test="$NAME='VersionStatus'">
                        <xsl:choose>
                            <xsl:when test="$VALUE='1'">
                                <xsl:value-of select="$releaseText"/>
                            </xsl:when>
                            <xsl:when test="$VALUE='2'">
                                <xsl:value-of select="$inProcessText"/>
                            </xsl:when>
                            <xsl:when test="$VALUE='3'">
                                <xsl:value-of select="$reservationText"/>
                            </xsl:when>
                            <xsl:when test="$VALUE='4'">
                                <xsl:value-of select="$supercededText"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="$NAME"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:when>
                    <xsl:when test="$NAME='ContentSize'">
                        <xsl:value-of select="java:com.filenet.wcm.toolkit.server.util.WcmUi.formatContentSize(string($VALUE), string($locale))"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="getNewValue">
                            <xsl:with-param name="theProperty" select="$theProperty"/>
                            <xsl:with-param name="checkReadOnly" select="$checkReadOnly"/>
                        </xsl:call-template>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:variable>

            <xsl:variable name="typeOfObject">
                <xsl:call-template name="getObjectType">
                    <xsl:with-param name="theProperty" select="$theProperty"/>
                </xsl:call-template>
            </xsl:variable>

            <!--++++++++++++++++++++++++++++++++++ End Set Variables, Start showing html ++++++++++++++++++++++++++++++++++-->
            <tr>
            
                 <xsl:if test="$objectType='document' or $objectSymname='GpnCaseFolder' or $objectSymname='GpnVolumeFolder'">
			     	<xsl:variable name="tabNumber" select="java:gpn.TabDefiner.getTabNumber(string($objectSymname), string($NAME))" />
		     		<xsl:attribute name="tab">
		               <xsl:value-of select="$tabNumber"></xsl:value-of>
		     		</xsl:attribute>
		         </xsl:if>
            
            
                <!-- Start showing first/required column-->
                <!-- required property indicator -->
                <td width="16">

                    <xsl:choose>
                        <xsl:when test="$showIndented">
                            <xsl:attribute name="class">wcmFormMainHeader</xsl:attribute>
                        </xsl:when>
                        <xsl:when test="$expandedPropID=wcm:symname">
                            <xsl:attribute name="class">wcmFormMainHeader</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:call-template name="setTDclass">
                                <xsl:with-param name="position" select="position() mod 2"/>
                            </xsl:call-template>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:choose>
                        <xsl:when test="$isSystemProps">&#160;</xsl:when>
                        <xsl:otherwise>
                            <xsl:choose>
                                <xsl:when test="wcm:isvalreq=1 and wcm:markings">
                                    <img title="{$requiredMarkingText}" border="0" src="images/state/RequiredMarking16.gif" width="16" height="10"/>
                                </xsl:when>
                                <xsl:when test="wcm:markings">
                                    <img title="{$markingText}" border="0" src="images/state/Marking16.gif" width="8" height="10"/>
                                </xsl:when>
                                <xsl:when test="wcm:isvalreq=1">
                                    <img title="{$requiredText}" border="0" src="images/state/Required16.gif" alt="{$requiredText}" width="16" height="16"/>
                                </xsl:when>
                                <xsl:otherwise>&#160;</xsl:otherwise>
                            </xsl:choose>
                        </xsl:otherwise>
                    </xsl:choose>
                </td>

                <!-- Show second/property column-->
                <td scope="row" width="170" nowrap="true">		<!-- Property name -->
                    <xsl:choose>
                        <xsl:when test="$expandedPropID=wcm:symname and not($showIndented)">
                            <xsl:attribute name="class">wcmFormMainHeader</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:call-template name="setTDclass">
                                <xsl:with-param name="position" select="position() mod 2"/>
                            </xsl:call-template>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:variable name="propertyName">
                        <xsl:choose>
                            <xsl:when test="wcm:symname=$propertyToRename">
                                <xsl:value-of select="$renamePropertyTo"/>:
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="wcm:name"/>:
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>

                    <xsl:choose>
                        <xsl:when test="$propertyExceptions and $propertyExceptions//wcm:error/wcm:symname=$NAME" >
                            <xsl:variable name="errorMessage" select="java:com.filenet.wcm.toolkit.util.WcmEncodingUtil.decodeLabel(string($propertyExceptions//wcm:error[wcm:symname=$NAME]/wcm:message))" />
                            <a class="wcmErrorFieldName">
                                <xsl:attribute name="title">
                                    <xsl:value-of select="$errorMessage" />
                                </xsl:attribute>
                                <xsl:call-template name="getPropertyName">
                                    <xsl:with-param name="theProperties" select="$theProperties"/>
                                    <xsl:with-param name="propertyName" select="$propertyName"/>
                                    <xsl:with-param name="typeOfObject" select="$typeOfObject"/>
                                    <xsl:with-param name="theProperty" select="$theProperty" />
                                    <xsl:with-param name="checkReadOnly" select="$checkReadOnly"/>
                                    <xsl:with-param name="errorMessage" select="$errorMessage" />
                                </xsl:call-template>
                            </a>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:call-template name="getPropertyName">
                                <xsl:with-param name="theProperties" select="$theProperties"/>
                                <xsl:with-param name="propertyName" select="$propertyName"/>
                                <xsl:with-param name="typeOfObject" select="$typeOfObject"/>
                                <xsl:with-param name="theProperty" select="$theProperty" />
                                <xsl:with-param name="checkReadOnly" select="$checkReadOnly"/>
                            </xsl:call-template>
                        </xsl:otherwise>
                    </xsl:choose>
                </td>

                <!-- Show third/value column-->
                <!-- Determine datatype and display accordingly -->
                <xsl:variable name="variableName">
                    <xsl:choose>
                        <xsl:when test="$recordsManageValue">
                            <xsl:value-of select="concat('RecordsManages-', wcm:symname)"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="wcm:symname"/>
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <!-- Determine datatype and display accordingly -->
                <td width="100%">

                    <xsl:choose>
                        <xsl:when test="$expandedPropID = wcm:symname and not($showIndented)">
                            <xsl:attribute name="class">wcmFormMainHeader</xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:call-template name="setTDclass">
                            <xsl:with-param name="position" select="position() mod 2"/>
                            </xsl:call-template>
                        </xsl:otherwise>
                    </xsl:choose>

                    <xsl:choose>
                        <!-- This is a special WCM property that needs a special UI rendering -->

                        <xsl:when test="wcm:symname = $releaseDateSymName">
                            <xsl:choose>
                                <xsl:when test="$newValue != $onApprovalDate">
                                    <xsl:choose>
                                        <xsl:when test="$checkReadOnly = 1">
                                            <xsl:call-template name="getHTMLFormInput">
                                                <xsl:with-param name="theProperty" select="$theProperty"/>
                                                <xsl:with-param name="checkReadOnly" select="$checkReadOnly"/>
                                                <xsl:with-param name="newValue" select="$newValue"/>
                                                <xsl:with-param name="typeOfObject" select="$typeOfObject"/>
                                                <xsl:with-param name="variableName" select="wcm:symname"/>
                                                <xsl:with-param name="theProperties" select="$output"/>

                                            </xsl:call-template>
                                            <input type="hidden" name="releaseDateOption" value="0" />
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <input type="radio" class="wcmFormText" name="releaseDateOption" value="0" >
                                                <xsl:attribute name="checked">checked</xsl:attribute>
                                            </input>
                                            <xsl:call-template name="getHTMLFormInput">
                                                <xsl:with-param name="theProperty" select="$theProperty"/>
                                                <xsl:with-param name="checkReadOnly" select="$checkReadOnly"/>
                                                <xsl:with-param name="newValue" select="$newValue"/>
                                                <xsl:with-param name="typeOfObject" select="$typeOfObject"/>
                                                <xsl:with-param name="variableName" select="wcm:symname"/>
                                                <xsl:with-param name="theProperties" select="$output"/>

                                            </xsl:call-template>
                                            <br/>
                                            <input type="radio" title="{$onApproval}" class="wcmFormText" name="releaseDateOption" value="1" >
                                                <xsl:value-of select="$onApproval"/>
                                            </input>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:choose>
                                        <xsl:when test="$checkReadOnly = 1">
                                            <xsl:value-of select="$onApproval"/>
                                            <input type="hidden" name="releaseDateOption" value="1" />
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <input type="radio" class="wcmFormText" name="releaseDateOption" value="0" />
                                            <xsl:call-template name="getHTMLFormInput">
                                                <xsl:with-param name="theProperty" select="$theProperty"/>
                                                <xsl:with-param name="checkReadOnly" select="$checkReadOnly"/>
                                                <xsl:with-param name="typeOfObject" select="$typeOfObject"/>
                                                <xsl:with-param name="variableName" select="wcm:symname"/>
                                                <xsl:with-param name="theProperties" select="$theProperties"/>

                                            </xsl:call-template>
                                            <br/>
                                            <input type="radio" title="{$onApproval}" class="wcmFormText" name="releaseDateOption" value="1" >
                                                <xsl:attribute name="checked">checked</xsl:attribute>
                                                <xsl:value-of select="$onApproval"/>
                                            </input>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:when>
                        <xsl:otherwise>
			                <xsl:call-template name="getHTMLFormInput">
			                    <xsl:with-param name="theProperty" select="$theProperty"/>
			                    <xsl:with-param name="checkReadOnly" select="$checkReadOnly"/>
			                    <xsl:with-param name="newValue" select="$newValue"/>
			                    <xsl:with-param name="typeOfObject" select="$typeOfObject"/>
			                    <xsl:with-param name="variableName" select="$variableName"/>
			                    <xsl:with-param name="showIndented" select="$showIndented"/>
			                    <xsl:with-param name="theProperties" select="$theProperties"/>

			                </xsl:call-template>
                        </xsl:otherwise>
                    </xsl:choose>

			<xsl:variable name="multiObjectsProp" select="$multiObjects/wcm:response/wcm:objectset/*/wcm:properties/wcm:property[wcm:symname=$NAME]"/>
			<xsl:if test="$multiObjectsProp/wcm:values/wcm:value">
				<xsl:choose>
					<xsl:when test="$expandedProperties/wcm:response/wcm:objectset/*/wcm:properties/wcm:property[wcm:symname=$NAME]/wcm:values/wcm:value">
					</xsl:when>
					<xsl:otherwise>
                                       <xsl:value-of select="$multiObjectsIndicator"/>		
					</xsl:otherwise>
				</xsl:choose>
			</xsl:if >
                </td>
            </tr>
            <xsl:if test="wcm:datatype='7'">
                <xsl:if test="$expandedPropID=wcm:symname and not($showIndented)">		<!-- Expanded Properties -->

                    <xsl:choose>
                        <xsl:when test="wcm:cardinality!='0'">   <!-- Multi Value -->
                            <xsl:variable name="expandedProperty" select="$expandedProperties/wcm:response/wcm:objectset/*/wcm:properties/wcm:property[wcm:symname=$NAME]"/>
                            <xsl:variable name="requiredClassName" select="wcm:reqclass/wcm:symname"/>

                            <xsl:choose>
                                <xsl:when test="$expandedProperty/wcm:values/wcm:value">
                                    <xsl:for-each select="$expandedProperty/wcm:values/wcm:value">
                                        <tr>
                                            <td width="16" class="wcmFormMainHeader"></td>
                                            <td width="170" nowrap="true">
                                                <xsl:call-template name="setTDclass">
                                                    <xsl:with-param name="position" select="position() mod 2"/>
                                                </xsl:call-template>
                                            </td>
                                            <td nowrap="true">
                                                <xsl:call-template name="setTDclass">
                                                    <xsl:with-param name="position" select="position() mod 2"/>
                                                </xsl:call-template>
                                                <xsl:value-of select="wcm:namevalue"/>
                                                <xsl:text>&#160;</xsl:text>
                                                <xsl:if test="$showInfoLink">
                                                    <xsl:variable name="expandedObjectType">
                                                        <xsl:choose>
                                                            <xsl:when test="$expandedProperty/wcm:objecttype=2">
                                                                <xsl:value-of select="'folder'"/>
                                                            </xsl:when>
                                                            <xsl:when test="$expandedProperty/wcm:objecttype=1">
                                                                <xsl:value-of select="'document'"/>
                                                            </xsl:when>
                                                            <xsl:when test="$expandedProperty/wcm:objecttype=-100">
                                                                <xsl:value-of select="'storedsearch'"/>
                                                            </xsl:when>
                                                            <xsl:when test="$expandedProperty/wcm:objecttype=-101">
                                                                <xsl:value-of select="'publishtemplate'"/>
                                                            </xsl:when>
                                                            <xsl:when test="$expandedProperty/wcm:objecttype=15">
                                                                <xsl:value-of select="'customobject'"/>
                                                            </xsl:when>
                                                            <xsl:when test="$expandedProperty/wcm:objecttype=1204">
                                                                <xsl:value-of select="'subscribedevent'"/>
                                                            </xsl:when>
                                                        </xsl:choose>
                                                    </xsl:variable>

                                                    <!-- don't display object info icon if object type list in filterObjectType variable -->
                                                    <xsl:if test="$expandedObjectType!=$filterObjectType" >
                                                        <xsl:variable name="returnUrl">
                                                            <xsl:choose>
                                                                <xsl:when test="$windowId != ''">
                                                                    <xsl:variable name="fullURL" select="concat($currentPageURL, '?windowId=', $rawWindowId)"/>
                                                                    <xsl:value-of select="java:com.filenet.wcm.toolkit.util.WcmEncodingUtil.encodeURL(string($fullURL))"/>
                                                                </xsl:when>
                                                                <xsl:otherwise>
                                                                    <xsl:value-of select="$currentPageURL"/>
                                                                </xsl:otherwise>
                                                            </xsl:choose>
                                                        </xsl:variable>
                                                        <xsl:if test="$expandedPropID!='SubscribedEvents'">
                                                            <xsl:variable name="infoLinkURL" select="concat($eventURL,
                                                                '&amp;eventName=',         'GetInfo',
                                                                '&amp;objectStoreName=', java:com.filenet.wcm.toolkit.util.WcmEncodingUtil.encodeLabel(string(wcm:objectstore/wcm:name)),
                                                                '&amp;id=',              wcm:id,
                                                                '&amp;objectType=',      $expandedObjectType,
                                                                '&amp;returnUrl=',       $returnUrl,
                                                                '&amp;class=',           $requiredClassName,
                                                                '&amp;label=',           java:com.filenet.wcm.toolkit.util.WcmEncodingUtil.encodeLabel(string(wcm:namevalue)))"/>
                                                            <a>
                                                                <xsl:attribute name="href">
                                                                    <xsl:choose>
                                                                        <xsl:when test="string-length($formName)>0">
                                                                            <xsl:value-of select="concat('javascript:document.forms.', $formName, '.action=', &quot;'&quot;, $infoLinkURL, &quot;'&quot;, ';document.forms.', $formName, '.submit();')"/>
                                                                        </xsl:when>
                                                                        <xsl:otherwise>
                                                                            <xsl:value-of select="$infoLinkURL"/>
                                                                        </xsl:otherwise>
                                                                    </xsl:choose>
                                                                </xsl:attribute>
                                                                <img title="{java:toString($wsGetInfoFor, string(wcm:namevalue))}" border="0" src="images/action/GetInfo16.gif" width="16" height="16"/>
                                                            </a>
                                                        </xsl:if>
                                                    </xsl:if>
                                                </xsl:if>
                                            </td>
                                        </tr>
                                    </xsl:for-each>
                                </xsl:when>
                                <xsl:otherwise>
                                    <tr>
                                        <td width="16" class="wcmFormMainHeader"></td>
                                        <td width="170" class="wcmFormRowEven" nowrap="true"></td>
                                        <td class="wcmFormRowEven" nowrap="true">
                                            <xsl:value-of select="$valueNotDefined"/>&#160;
                                            <xsl:value-of select="$requiredClass"/>:&#160;
                                            <xsl:value-of select="wcm:reqclass/wcm:dispname"/>
                                        </td>
                                    </tr>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:when>
                        <xsl:when test="$expandedProperties and $expandedPropdescs and not($showIndented)">
                            <xsl:call-template name="propertyLoop">
                                <xsl:with-param name="propdescs" select="$expandedPropdescs/wcm:response/wcm:objectset/wcm:objectstore/wcm:classdesc/wcm:propdescs//wcm:propdesc[wcm:symname!='MimeType' and wcm:symname!='SecurityTemplates' and wcm:symname!='SourceDocument' and wcm:symname!='DestinationDocuments' and wcm:symname!='ITXFormTemplate' and wcm:symname!='FormPolicy' and wcm:symname != 'RecordInformation' and wcm:symname!=$filterProperty and wcm:symname!=$filterProperty2][wcm:ishidden!=1][wcm:issysowned=0 or (wcm:isreadonly!=1 and wcm:setability!=3)][wcm:datatype!=1]"/>
                                <xsl:with-param name="theProperties" select="$expandedProperties"/>
                                <xsl:with-param name="isReadOnly" select="true()"/>
                                <xsl:with-param name="showIndented" select="true()"/>
                            </xsl:call-template>
                        </xsl:when>
                        <xsl:otherwise>
                            <tr>
                                <td width="16" class="wcmFormMainHeader"></td>
                                <td width="170" class="wcmFormRowEven" nowrap="true"></td>
                                <td class="wcmFormRowEven" nowrap="true">
                                    <xsl:value-of select="$valueNotDefined"/>&#160;
                                    <xsl:value-of select="$requiredClass"/>:&#160;
                                    <xsl:value-of select="wcm:reqclass/wcm:dispname"/>
                                </td>
                            </tr>
                        </xsl:otherwise>
                    </xsl:choose>
                    <xsl:if test="position() != last()">
                        <xsl:call-template name="bottomSeparator"/>
                    </xsl:if>
                </xsl:if>
            </xsl:if>
        </xsl:for-each>

    </xsl:template>

    <!--++++++++++++++++++++++++++++++++++ Compound Document Section Template ++++++++++++++++++++++++++++++++++-->
    <xsl:template name="cdSection">
        <xsl:choose>
            <xsl:when test="$compoundDocumentState = false()">
                <xsl:call-template name="getCdSection">
                    <xsl:with-param name="cdPropDesc" select="$allPropDescs[wcm:symname = 'CompoundDocumentState']" />
                </xsl:call-template>
            </xsl:when>
            <xsl:when test="$compoundDocumentState/wcm:ishidden = 0">
                <xsl:call-template name="getCdSection">
                    <xsl:with-param name="cdPropDesc" select="$compoundDocumentState" />
                </xsl:call-template>
            </xsl:when>
        </xsl:choose>
    </xsl:template>

    <xsl:template name="getCdSection">
        <xsl:param name="cdPropDesc"/>
        <xsl:variable name="isReadOnly" select="$cdPropDesc/wcm:isreadonly = 1"/>
        <tr>
            <td class="wcmFormText" colspan="4">
                <img alt="" src="images/web/common/Spacer.gif" width="16" height="16"/>
            </td>
        </tr>
        <xsl:call-template name="optionHeader">
            <xsl:with-param name="columnHeader" select="$wsCompoundDocumentHeader"/>
        </xsl:call-template>
        <!-- Add the Compound Document row -->
        <tr class="wcmFormRowEven">
            <td class="wcmFormText" width="1%">
                <img title="{$requiredText}" src="images/state/Required16.gif" alt="{$requiredText}" width="16" height="16"/>
            </td>
            <td>
                <xsl:value-of select="$wsCompoundDocument"/>
            </td>
            <td>

                <xsl:variable name="value" >
                    <xsl:variable name="currentValue" select="$output/wcm:response/wcm:objectset/*/wcm:properties/wcm:property[wcm:symname = 'CompoundDocumentState']/wcm:value" />
                    <xsl:choose>
                        <xsl:when test="$currentValue">
                                <xsl:value-of select="$currentValue"/>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:value-of select="$cdPropDesc/wcm:propdef" />
                        </xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:call-template name="BooleanValue">
                    <xsl:with-param name="value" select="$value"/>
                    <xsl:with-param name="symname" select="'CompoundDocumentState'"/>
                    <xsl:with-param name="readonly" select="$isReadOnly or $canChangeCDState = false()"/>
                    <xsl:with-param name="requiredProperty" select="true()" />
                    <xsl:with-param name="trueLabel" select="$yes"/>
                    <xsl:with-param name="falseLabel" select="$no"/>
                    <xsl:with-param name="showBlankOption" select="false()"/>
                    <xsl:with-param name="dispname" select="$wsCompoundDocumentHeader"/>
                </xsl:call-template>
            </td>
        </tr>
        <!-- Add the Children row -->
        <tr class="wcmFormRowOdd">
            <td class="wcmFormText" width="1%">
                <img alt="" src="images/web/common/Spacer.gif" width="16" height="16"/>
            </td>
            <td>
                <xsl:value-of select="$wsChildren"/>
            </td>
            <td>
                <a class="wcmFormLink"  href="javascript:document.forms.{$formName}.action='{$eventURL}&amp;eventName=ShowChildren&amp;mode={$isReadOnly}';document.forms.{$formName}.submit()">
                    <xsl:value-of select="$wsShow"/>
                </a>&#160;
                <xsl:if test="$isReadOnly = false() and $canEditCD" >
                    <a class="wcmFormLink"  href="javascript:document.forms.{$formName}.action='{$eventURL}&amp;eventName=AddChild';document.forms.{$formName}.submit()">
                        <xsl:value-of select="$addChildLabel"/>
                    </a>&#160;
                </xsl:if>
            </td>
        </tr>
    </xsl:template>

    <!--++++++++++++++++++++++++++++++++++ Options Section Template ++++++++++++++++++++++++++++++++++-->
    <xsl:template name="optionSection">
        <tr>
            <td class="wcmFormText" colspan="4">
                <img alt="" src="images/web/common/Spacer.gif" width="16" height="16"/>
            </td>
        </tr>
        <xsl:call-template name="optionHeader"/>
        <!-- Add Add as major version or Checkin as major version row -->
        <tr class="wcmFormRowEven">
            <td class="wcmFormText" width="1%">
                <img alt="{$wsUseArrowKeys}" src="images/web/common/Spacer.gif" width="16" height="16"/>
            </td>
            <xsl:if test="$isCheckin=1">
                <td>
                    <xsl:value-of select="$chkinMajorVer"/>:
                </td>
            </xsl:if>
            <xsl:if test="$isCreate=1">
                <td>
                    <xsl:value-of select="$addMajorVer"/>:
                </td>
            </xsl:if>
            <td>
                <xsl:variable name="newValue">
                    <xsl:if test="$promoteAsMajorVersion=true()">
                        <xsl:value-of select="'1'"/>
                    </xsl:if>
                    <xsl:if test="$promoteAsMajorVersion=false()">
                        <xsl:value-of select="'0'"/>
                    </xsl:if>
                </xsl:variable>
                <xsl:call-template name="BooleanValue">
                    <xsl:with-param name="value" select="$newValue"/>
                    <xsl:with-param name="symname" select="'promoteVersion'"/>
                    <xsl:with-param name="readonly" select="$rightToPromote=false()"/>
                    <xsl:with-param name="requiredProperty" select="true()" />
                    <xsl:with-param name="trueLabel" select="$yes"/>
		            <xsl:with-param name="falseLabel" select="$no"/>
                    <xsl:with-param name="showBlankOption" select="false()"/>
                    <xsl:with-param name="dispname" select="$promoteAsMajorVersionText"/>
                </xsl:call-template>
            </td>
        </tr>

    </xsl:template>

    <!--++++++++++++++++++++++++++++++++++ Bottom Separator Template ++++++++++++++++++++++++++++++++++-->
    <xsl:template name="bottomSeparator">
        <!-- separator  -->
        <tr>
            <td colspan="3" class="wcmFormMainHeader" style="padding: 0px">
                <img alt="" src="images/web/common/Spacer.gif" width="1" height="3"/>
            </td>
        </tr>
    </xsl:template>





    <!-- display class name if present -->
    <xsl:template name="displayClassName">
        <xsl:if test="$className">
            <tr height="2">
                <td class='wcmFormText' colspan='5' align='left' nowrap="true">
                    <span class="wcmClassPathLabel">
                        <xsl:value-of select="$class"/>
                    </span>
                    <font class='wcmPathLinkEnd'>
                        <xsl:text>&#160;</xsl:text>
                        <xsl:value-of select="$className"/>
                    </font>
                    <xsl:if test="$showSelectClassLink = 1">
                        <xsl:text>&#160;&#160;</xsl:text>
                        <a class="wcmFormLink" href="#">
                            <xsl:attribute name="onclick">
                                <!-- doesn't use controller.createPopup() -->
                                <xsl:variable name="returnUrl">
                                    <xsl:value-of select="$eventURL" />
                                    <xsl:text>&amp;eventName=SetClass&amp;itemId=</xsl:text>
                                    <xsl:value-of select="@itemid" />
                                </xsl:variable>
                                <xsl:variable name="ru" select="java:com.filenet.wcm.toolkit.util.WcmEncodingUtil.encodeURL(string($returnUrl))" />
                                <xsl:text>createNewWindow(baseURL + '</xsl:text>
                                <xsl:text>/operations/SelectClass.jsp?returnUrl=</xsl:text>
                                <xsl:value-of select="$ru" />
                                <xsl:if test="$lockSelectClassOS">
                                    <xsl:text>&amp;objectStoreName=</xsl:text>
                                    <xsl:value-of select="$encodedObjectStoreName" />
                                </xsl:if>
                                <xsl:text>&amp;rootClass=</xsl:text>
                                <xsl:value-of select="$rootClassId" />
                                <xsl:text>&amp;objectType=</xsl:text>
                                <xsl:value-of select="$objectType" />
                                <xsl:text>&amp;parentFormId=</xsl:text>
                                <xsl:value-of select="$formName" />
                                <xsl:text>&amp;requestedWindowId=</xsl:text>
                                <xsl:value-of select="$rootClassId" />
                                <xsl:if test="$isCheckin = 0 and $lockSelectClassOS">
                                    <xsl:value-of select="$encodedObjectStoreName" />
                                </xsl:if>
                                <xsl:if test="$includedClasses">
                                    <xsl:for-each select="$includedClasses">
                                        <xsl:text>&amp;classSymName=</xsl:text>
                                        <xsl:value-of select="java:com.filenet.wcm.toolkit.util.WcmEncodingUtil.encodeLabel(.)"/>
                                    </xsl:for-each>
                                </xsl:if>
                                <xsl:text>', '_blank', 'no', 'no', 'yes', 'yes',  700, 450, 'center', 'middle', 'yes'); return false;</xsl:text>
                            </xsl:attribute>
                            <xsl:value-of select="$wsChangeClass"/>
                        </a>
                    </xsl:if>
                </td>
            </tr>
        </xsl:if>
    </xsl:template>

    <!-- row with LifetcycleState -->
    <xsl:template name="lifecycleField">
        <xsl:if test="$showLifecycle=true()">
            <xsl:if test="$showApply=true()">
                <tr>
                    <xsl:call-template name="setTDclass">
                        <xsl:with-param name="position" select="1 + position() mod 2"/>
                    </xsl:call-template>
                    <td>
                        <img title="{$lifeCycleText}" border="0" src="images/state/LifeCycle16.gif" width="16" height="16"/>
                    </td>
                    <td scope="row" width="20%" nowrap="true">
                        <xsl:value-of select="$wsLifecycle"/>:&#160;
                        <xsl:text>&#160;</xsl:text>
                    </td>
                    <td width="80%">
                        <select name="lifeCycleStatus">
                            <xsl:if test="$demoteString">
                                <option value="{$demoteValue}">
                                    <xsl:value-of select="$demoteString"/>
                                </option>
                            </xsl:if>
                            <option value="0">
                                <xsl:if test="$currentValue=0">
                                    <xsl:attribute name="selected">selected</xsl:attribute>
                                </xsl:if>
                                <xsl:value-of select="$lifecycleState"/>
                            </option>
                            <xsl:if test="$promoteString">
                                <option value="{$promoteValue}">
                                    <xsl:if test="$currentValue=$promoteValue">
                                        <xsl:attribute name="selected">selected</xsl:attribute>
                                    </xsl:if>
                                    <xsl:value-of select="$promoteString"/>
                                </option>
                            </xsl:if>
                            <xsl:if test="$clearExceptionString">
                                <option value="{$clearExceptionValue}">
                                    <xsl:if test="$currentValue=$clearExceptionValue">
                                        <xsl:attribute name="selected">selected</xsl:attribute>
                                    </xsl:if>
                                    <xsl:value-of select="$clearExceptionString"/>
                                </option>
                            </xsl:if>
                            <xsl:if test="$setExceptionString">
                                <option value="{$setExceptionValue}">
                                    <xsl:if test="$currentValue=$setExceptionValue">
                                        <xsl:attribute name="selected">selected</xsl:attribute>
                                    </xsl:if>
                                    <xsl:value-of select="$setExceptionString"/>
                                </option>
                            </xsl:if>
                            <xsl:if test="$resetString">
                                <option value="{$resetValue}">
                                    <xsl:if test="$currentValue=$resetValue">
                                        <xsl:attribute name="selected">selected</xsl:attribute>
                                    </xsl:if>
                                    <xsl:value-of select="$resetString"/>
                                </option>
                            </xsl:if>
                        </select>
                    </td>
                </tr>
            </xsl:if>
            <xsl:if test="$showApply=false()">
                <tr>
                    <xsl:call-template name="setTDclass">
                        <xsl:with-param name="position" select="1 + position() mod 2"/>
                    </xsl:call-template>
                    <td>
                        <img title="{$lifeCycleText}" border="0" src="images/state/LifeCycle16.gif" width="16" height="16"/>
                    </td>
                    <td scope="row" width="20%" nowrap="true">
                        <xsl:value-of select="$wsLifecycle"/>:&#160;
                        <xsl:text>&#160;</xsl:text>
                    </td>
                    <td width="80%">		<!-- Property name -->
                        <xsl:value-of select="$lifecycleState"/>
                    </td>
                </tr>
            </xsl:if>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>

