<?php

namespace Lib\Rss\Contracts;

/**
 * @package Lib\Rss\Contracts
 */
interface Category
{
    /**
     * @return string
     */
    public function getValue(): string;

    /**
     * @param string $value
     * @return $this
     */
    public function setValue(string $value);
}
