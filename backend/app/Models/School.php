<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Contracts\Tenant;
use Stancl\Tenancy\Database\Concerns\HasDomains;

class School extends Model implements Tenant
{
    use HasFactory, HasDomains;

    protected $fillable = [
        'school_name',
        'logo',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'pincode',
        'timezone',
        'subscription_plan',
        'subscription_expiry',
        'status',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function classes()
    {
        return $this->hasMany(StudentClass::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class)->latestOfMany();
    }

    public function getTenantKeyName(): string
    {
        return 'id';
    }

    public function getTenantKey()
    {
        return $this->getAttribute($this->getTenantKeyName());
    }

    public function setTenantKey($value)
    {
        return $this->setAttribute($this->getTenantKeyName(), $value);
    }

    public function getInternal(string $key)
    {
        return null;
    }

    public function setInternal(string $key, $value): self
    {
        return $this;
    }

    public function run(callable $callback)
    {
        $originalTenant = tenancy()->tenant;
        tenancy()->initialize($this);
        $result = $callback($this);
        if ($originalTenant) {
            tenancy()->initialize($originalTenant);
        } else {
            tenancy()->end();
        }
        return $result;
    }
}
