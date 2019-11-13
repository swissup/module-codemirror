<?php

namespace Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field;

class Inlinecss extends Css
{
    /**
     * {@inheritdoc}
     */
    public function getMode()
    {
        return ['name' => 'css', 'inline' => true];
    }
}
