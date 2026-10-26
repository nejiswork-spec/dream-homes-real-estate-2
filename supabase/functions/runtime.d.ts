// Local type-checking surface. The deployed runtime supplies Deno.
declare const Deno:{env:{get(name:string):string|undefined};serve(handler:(request:Request)=>Promise<Response>):void};
