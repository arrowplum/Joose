/**

NAME
====

Joose.Manual.Traits - Special kind of Roles in Joose.


WHAT IS A TRAIT?
================

In Joose, a trait is almost exactly the same thing as a role, which is composed into an instance of a class at runtime to add or modify the behavior of *just that instance*. 
Other instances are not affected. 

Any role can be used as a trait. There is no special `Trait` helper or other syntax constructs.

  
        Role('Logger', {
            
            requires : [ 'process' ],
            
            before : {
                process : function () {
                    this.log("'process' method was called with the arguments:" + arguments)
                }
            },
            
            
            methods : {
                log : function () {
                    ...
                }
            }
        })
        
        
        Class('Parser', {
        
            methods : {
                process : function () {
                    ...
                }
            }
        })


APPLYING TRAIT. DETACHING
=========================

Traits can be applied only during object's instantiation. To apply the trait, provide the "pseudo-builder" `trait` (or `traits`) to class constructor:

        var parser = new Parser({
            trait : Logger
        })
        
Now this particular `parser` instance will perform additional loging during work. Note that any other instances of `Parser` will not be not affected.


You may also return the `trait` builder from the `BUILD` method (if you are using custom parameters processing).

Under the hood, the `parser` instance will have its own instance of metaclass, separated from `Person`:
    
        console.log(parser.meta != Parser.meta) // true, instance was detached
        console.log(parser instanceof Parser)   // true, its still Parser however )
        
You can *extend* this particular instance as usual class:
        
        parser.meta.extend({
            does : AnotherLogger
        })
        
If you don't want to apply trait during object's instantiation, but planning to do it later, you need to create it as *detached*. Use pseudo-builder `detached` for that:

        var parser = new Parser({
            detached : true
        })
        
        ...
        
        //later
        
        if (...) parser.meta.extend({
            does : Logger
        })

 
REMOVING TRAIT.
===============

You may decide to remove the trait (rememeber, all Joose classes are mutable at run-time).

        parser.meta.extend({
            doesnot : Logger
        })
        
        
TRAITS AS META-ROLES
====================

Sometime traits are also mentioned in *meta-role* context. This means, that this trait is being applied to the instance of meta-class.
Such traits modifies the *behaviour of class itself* (its meta), not its methods or attributes. 

An example of such trait can be a [JooseX.Class.Singleton](http://samuraijack.github.com/JooseX-Class-Singleton):


        Class('Some.Class', {
            trait : JooseX.Class.Singleton,
            
            has : {
                ...
            },
            
            methods : {
                ...
            }
        })


AUTHOR
======

Nickolay Platonov [nickolay8@gmail.com](mailto:nickolay8@gmail.com)


COPYRIGHT AND LICENSE
=====================

Copyright (c) 2008-2010, Malte Ubl, Nickolay Platonov

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Malte Ubl nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 

*/
