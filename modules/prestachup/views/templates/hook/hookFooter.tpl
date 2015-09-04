{*
* Starter Module
* 
*  @author    PremiumPresta <office@premiumpresta.com>
*  @copyright 2014 PremiumPresta
*  @license   http://creativecommons.org/licenses/by-nd/4.0/ CC BY-ND 4.0
*}

<!-- Main menu-->
<section id="footer-menu" class="footer-block col-xs-12 col-sm-3 col-md-3">
    <h4>
        <img class="logo" src="{$img_dir}reppn/reppin_logo_white.svg" alt="{$shop_name|escape:'html':'UTF-8'}" />
        <span>{l s='Repp\'n' mod='reppin'}</span>
    </h4>

    <ul>

        {foreach from=$links item=link}
            <li>{$link}</li>
        {/foreach}

    </ul>
</section>
<!-- end main menu-->