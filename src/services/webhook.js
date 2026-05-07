export const getOrCreateWebhook = async (channel) => {
    const webhooks = await channel.fetchWebhooks();
    
    let webhook = webhooks.find(w => w.name === "AnonBot" )

    if(!webhook){
        webhook = await channel.createWebhook({
            name:"AnonBot"
        })
    }
    return webhook
}