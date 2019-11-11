<?php

namespace Swissup\Codemirror\Block\Adminhtml\System\Config\Form\Field;

use Magento\Config\Block\System\Config\Form\Field;
use Magento\Framework\Data\Form\Element\AbstractElement;

class Htmlmixed extends Css
{
    /**
     * Get editor mode.
     *
     * @return string
     */
    public function getMode()
    {
        return 'htmlmixed';
    }
}
