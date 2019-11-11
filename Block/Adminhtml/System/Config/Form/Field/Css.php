<?php

namespace Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field;

use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Data\Form\Element\AbstractElement;

class Css extends Field
{
    /**
     * @var string
     */
    protected $_template = 'form/field/editor.phtml';

    /**
     * Render element HTML
     *
     * @param  AbstractElement $element
     * @return string
     */
    protected function _getElementHtml(AbstractElement $element)
    {
        $this->setElement($element);
        $this->setScope($element->getHtmlId());
        $this->initJsLayout();
        return $this->toHtml();
    }

    /**
     * Initialize js layout.
     */
    public function initJsLayout()
    {
        $element = $this->getElement();
        $value = $element->getValue();
        $scope = $this->getScope();
        $name = $element->getName();
        $isDisabled = !!$element->getData('disabled');
        $this->jsLayout = [
            'components' => [
                $scope => [
                    'component' => 'uiComponent',
                    'children' => [
                        $scope => [
                            'dataScope' => $name,
                            'value' => $value,
                            'disabled' => $isDisabled,
                            'config' => [
                                'component' => 'Swissup_Codemirror/js/form/element/editor',
                                'template' => 'ui/form/field',
                                'dataType' => 'text',
                                'visible' => true,
                                'formElement' => 'textarea',
                                'labelVisible' => false,
                                'inputId' => $element->getHtmlId(),
                                'editorConfig' => [
                                    'mode' => $this->getMode(),
                                    'readOnly' => $isDisabled ? 'nocursor' : false,
                                    'lineWrapping' => true
                                ]
                            ]
                        ]
                    ]

                ]
            ]
        ];
    }

    /**
     * Get editor mode.
     *
     * @return string
     */
    public function getMode()
    {
        return 'css';
    }
}
