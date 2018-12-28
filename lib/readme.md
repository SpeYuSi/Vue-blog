
### .exec 和 .then
两者返回的都是 promise对象
exec一般用于独立的动作一次性执行，
then则用于连续性的动作
exec和then的参数是有所不同的，前者是 callback(err,doc)，后者则是 resolved(doc),rejected(err)
