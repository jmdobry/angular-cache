#### 1.x.x. ---> 2.0.0 - xx October 2013

##### Breaking API changes
- Swapped `aggressiveDelete` option for `deleteOnExpire` option.

###### 1.x.x
Aggressively delete expiring items.
```javascript
$angularCacheFactory('myNewCache', {
    maxAge: 90000, // Items added to this cache expire after 15 minutes
    aggressiveDelete: true // Items will be actively deleted when they expire
});
```

Passively delete items when they are requested after they have expired.
```javascript
$angularCacheFactory('myNewCache', {
    maxAge: 90000, // Items added to this cache expire after 15 minutes
    aggressiveDelete: false // Items will be actively deleted when they expire
});
```

###### 2.0.0
Aggressively delete expiring items.
```javascript
$angularCacheFactory('myNewCache', {
    maxAge: 90000, // Items added to this cache expire after 15 minutes
    deleteOnExpire: 'aggressive' // Items will be actively deleted when they expire
});
```

Passively delete items when they are requested after they have expired.
```javascript
$angularCacheFactory('myNewCache', {
    maxAge: 90000, // Items added to this cache expire after 15 minutes
    deleteOnExpire: 'passive' // Items will be passively deleted when requested after expiration
});

Do nothing with expired items (not in 1.x.x).
```javascript
$angularCacheFactory('myNewCache', {
    maxAge: 90000, // Items added to this cache expire after 15 minutes
    deleteOnExpire: 'none' // Items will expire but not be removed
});
```