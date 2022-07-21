# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here
Only valid way to get the trivial partition is when event is null.
sha3-512 hash created will always be 128 characters long if represented in hexadecimal. 
So, the only way candidate can be more than the MAX_PARTITION_KEY_LENGTH is when paritionKey is provided in event which exceeds this size. 
Also, `crypto.createHash("sha3-512").update(candidate).digest("hex")` is used multiple times in the code. I have moved it out to a seperate function.
I have used the above observations to refactor the code and make it clean. The intention in the code is much more clear than it was before. 
