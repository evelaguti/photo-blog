<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

/**
 * @package App\Mail
 */
class WeeklySubscription extends Mailable
{
    /**
     * @var array
     */
    public $data;

    /**
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->to($this->data['subscriber_email'])
            ->subject(sprintf('%s - %s', config('app.name'), trans('mails.weekly-subscription.subject')))
            ->view('app.mails.en.weekly-subscription', ['data' => $this->data]);
    }
}
