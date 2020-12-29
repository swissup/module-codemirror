# CodeMirror

CodeMirror - is a Magento 2 module that integrates
[CodeMirror - in-browser code editor](https://codemirror.net/) into Magento 2.

Current version of module has implementations for Magento Admin only:

 -  form element for UI components;
 -  frontend models for Magento System Config.

### Installation

```bash
composer require swissup/module-codemirror
bin/magento setup:upgrade
```

### Usage

#### UI Component

Example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<form xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Ui:etc/ui_configuration.xsd">
    ...
    <fieldset name="general">
        ...
        <field name="template_text">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="dataType" xsi:type="string">string</item>
                    <item name="label" xsi:type="string" translate="true">Template Content</item>
                    <item name="formElement" xsi:type="string">textarea</item>
                    <item name="component" xsi:type="string">Swissup_Codemirror/js/form/element/editor</item>
                    <item name="editorConfig" xsi:type="array">
                        <item name="mode" xsi:type="string">htmlmixed</item>
                    </item>
                    <item name="validation" xsi:type="array">
                        <item name="required-entry" xsi:type="boolean">true</item>
                    </item>
                </item>
            </argument>
        </field>
        <field name="template_styles">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="dataType" xsi:type="string">string</item>
                    <item name="label" xsi:type="string" translate="true">Template Styles</item>
                    <item name="formElement" xsi:type="string">textarea</item>
                    <item name="component" xsi:type="string">Swissup_Codemirror/js/form/element/editor</item>
                    <item name="editorConfig" xsi:type="array">
                        <item name="mode" xsi:type="string">css</item>
                    </item>
                </item>
            </argument>
        </field>
    </fieldset>
</form>

```

Use option `editorConfig` to pass additional paramenets to editor. `mode` can be either string or an object. Check [CodeMirror Modes](https://codemirror.net/mode/) itself to find out more.

#### System Config

Example:

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Config:etc/system_file.xsd">
    <system>
        <section id="prolabels" translate="label" type="text" sortOrder="1668" showInDefault="1" showInWebsite="1" showInStore="1">
            ...
            <group id="general" translate="label" sortOrder="1" showInDefault="1" showInWebsite="1" showInStore="1">
                <label>General</label>
                ...
                <field id="css" translate="label" type="textarea" sortOrder="10" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>CSS</label>
                    <frontend_model>Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\Css</frontend_model>
                </field>
                <field id="less" translate="label" type="textarea" sortOrder="12" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>LESS</label>
                    <frontend_model>Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\Less</frontend_model>
                </field>
                <field id="scss" translate="label" type="textarea" sortOrder="12" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>SCSS</label>
                    <frontend_model>Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\Scss</frontend_model>
                </field>
                <field id="js" translate="label" type="textarea" sortOrder="20" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>JS</label>
                    <frontend_model>Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\Javascript</frontend_model>
                </field>
                <field id="yaml" translate="label" type="textarea" sortOrder="25" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>YAML</label>
                    <frontend_model>Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\Yaml</frontend_model>
                </field>
                <field id="yaml-frontmatter" translate="label" type="textarea" sortOrder="26" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>YAML Frontmatter</label>
                    <frontend_model>Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\Yamlfrontmatter</frontend_model>
                </field>
                <field id="text" translate="label" type="textarea" sortOrder="30" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>Label Text</label>
                    <frontend_model>Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\Htmlmixed</frontend_model>
                </field>
                <field id="custom" translate="label" type="textarea" sortOrder="50" showInDefault="1" showInWebsite="1" showInStore="1">
                    <label>Label Inline Styles</label>
                    <frontend_model>Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\Inlinecss</frontend_model>
                </field>
            </group>
        </section>
    </system>
</config>
```

There are 9 frontend models for system config:

 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Css**
 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Less**
 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Scss**
 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Javascript**
 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Htmlmixed**
 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Inlinecss**
 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Json**
 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Yaml**
 -  Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field\\**Yamlfrontmatter**
