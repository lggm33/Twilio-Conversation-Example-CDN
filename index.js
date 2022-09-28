const token = ""
const client = new Twilio.Conversations.Client(token);
console.log(client)

client.on('stateChanged', (state) => {
  if (state === 'initialized') {
    console.log({client})
    runApp()
}
})

async function runApp() {

    //change the unique name after each iteration
    const uniqueName = ""

    try {
        const allConversation = await client.getSubscribedConversations()
        console.log({allConversation})
        
        if (allConversation.items.length === 0) {
            console.log('the user does not have conversations')
            return
        }

        const oneConversation = allConversation.items[4]
        const conversationBySid = await client.getConversationBySid(oneConversation.sid)
        const conversationMessages = await conversationBySid.getMessages()
        
        console.log({conversationBySid})
        console.log({conversationMessages})
        
        await conversationBySid.sendMessage("test message")

        if (!oneConversation.channelState.uniqueName) {
            console.log(`the conversation ${oneConversation.sid} does not have a unique name`)
            const oneConversationUpdated = await oneConversation.updateUniqueName(uniqueName)
            console.log(`the conversation ${oneConversation.sid} has updated the uniqueName to ${oneConversationUpdated.channelState.uniqueName}`)
        }
        

        const conversationByUniqueName = await client.getConversationByUniqueName(oneConversation.channelState.uniqueName)
        console.log({conversationByUniqueName})
        
    } catch (error) {
        console.log(error)
    }
}