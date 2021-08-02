<?php
namespace Drupal\eb_extra\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
/**
 * Redirect .html pages to corresponding Node page.
 */
class EbExtraSubscriber implements EventSubscriberInterface {
  /**
   * Redirect pattern based url
   * @param RequestEvent $event
   */
  public function jsCallback(\Drupal\entity_browser\Events\RegisterJSCallbacks $event) {
    $event->removeCallback('Drupal.entityBrowser.selectionCompleted');
    $event->registerCallback("Drupal.ebExtra.selectionCompleted");
  }

  /**
   * Listen to kernel.request events and call customRedirection.
   * {@inheritdoc}
   * @return array Event names to listen to (key) and methods to call (value)
   */
  public static function getSubscribedEvents() {
    $events[\Drupal\entity_browser\Events\Events::REGISTER_JS_CALLBACKS][] = array('jsCallback');
    return $events;
  }
}
