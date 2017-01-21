<?php

namespace App\Models\DB;

use Carbon\Carbon;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Class User.
 *
 * @property int id
 * @property int role_id
 * @property string name
 * @property string email
 * @property string password
 * @property string api_token
 * @property string remember_token
 * @property Carbon created_at
 * @property Carbon updated_at
 * @property Role role
 * @method static User whereEmail($email)
 * @method static User whereId($id)
 * @package App\Models\DB
 */
class User extends Authenticatable
{
    use Notifiable;

    /**
     * @inheritdoc
     */
    protected $fillable = [
        'name',
        'email',
    ];

    /**
     * @inheritdoc
     */
    protected $with = ['role'];

    /**
     * @inheritdoc
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function (User $user) {
            $user->photos()->delete();
        });
    }

    /**
     * Set password hash.
     *
     * @param string $passwordHash
     *
     * @return $this
     */
    public function setPasswordHash(string $passwordHash)
    {
        $this->password = $passwordHash;

        return $this;
    }

    /**
     * Generate unique api token.
     *
     * @return $this
     */
    public function generateApiToken()
    {
        $this->api_token = str_random(64);

        return $this;
    }

    /**
     * Set customer role.
     *
     * @return $this
     */
    public function setCustomerRole()
    {
        $this->role_id = Role::customer()->first()->id;

        return $this;
    }

    /**
     * Set administrator role.
     *
     * @return $this
     */
    public function setAdministratorRole()
    {
        $this->role_id = Role::administrator()->first()->id;

        return $this;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function photos()
    {
        return $this->hasMany(Photo::class);
    }

    /**
     * Check if user is 'Administrator'.
     *
     * @return string
     */
    public function isAdministrator()
    {
        return $this->role->name === Role::NAME_ADMINISTRATOR;
    }

    /**
     * Check if user is 'Customer'.
     *
     * @return string
     */
    public function isCustomer()
    {
        return $this->role->name === Role::NAME_CUSTOMER;
    }
}
