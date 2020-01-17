Desc:  

create debug from "debug" using module.id/filename  

...WIP

Requires:  
    Node like modules as in  { id: filename, filename: __filename }

Install:  

    npm i @d10221/create-debug

Usage:

    /** 
     * with default options
     */
    import { debugModule }  from "@d10221/create-debug";
    const debug = debugModule(module); // IDebugger
    debug("Hello"); // => 'packageName|parent|moduleFileName Hello'

    /** 
     * with options 
     */
    import { debugModule } from "@d10221/create-debug";
    const debug /*:IDebugger*/ = debugModule(module, {
        out: console.log.bind(console),
        suffix: ":"
    });    
    debug("Hello"); // => 'packageName|parent|moduleFileName: Hello'

    /** 
     * to change IDebug/IDebugFty 
     */
     import { moduleDebugger } from "@ausrtalis/create-debug/";
     const debugModule = moduleDebugger(
            require("debug"), 
                { 
                    suffix: ":", 
                    out: console.log.bind(console)
                }
            );
    const debug = debugModule(module);
    debug.log("Hello); // => 'packageName|parent|moduleFileName: Hello'

Notes/Features:  

Debugger namespace: `${package.name}|${module.filename.parents}|${module.name}`

- parents+name: collapsed/compressed, ex: xyz/xyz/xyz => xyz  
- index: collapsed to parent dir or package.name  
- redirects to stdout if process.env.DEBUG_TO === "stdout"  

It tries to favor/promote:    
 - no-config
 - consitent/normalized namespaceing 
 - predictable output
 - locate debug/logging source
 - folder-module-pattern
 - flat-nesting
 - short-names
 - name-re-use
 - namespacing
 - re-exports
 - feature-function classification  

 ex:

    @my/pkg|repo|users|get
    @your/auth/handler|login
    @else/auth/middleware|require-role

eventually:

    reuse Debug as Logger  
    use-case:   
        wrapped nodejs app as a service that redirects stdout to a file  
        ex: node-windows

Todo:   

provide global hook to Debug.log,  
maybe a global event?