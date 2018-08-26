#png(file="notitle.png",width=1200, height=550)
svg(file="notitle.svg",width=16, height=8, pointsize=12)
mydata = read.table("file.csv",header=TRUE,sep="\t",check.names=F)
matplot(mydata[,1],mydata[,-1],type=c("l","l"),ylim=c(0,80),xlab="Time in ms",ylab="Current in mA",col=c("black","blue"),lty=1,main="ESP8266: Power consumption in modem sleep and light sleep")

rect(4500,0,4700,80,border="gray",lwd=2)
text(x=4750,y=70,pos=4,labels="Refresh\nlwm2m\nlifetime")

rect(570,0,770,80,border="gray",lwd=2)
text(pos=4,x=820,y=70,labels="Request all")

rect(2050,0,2250,80,border="gray",lwd=2)
text(pos=4,x=2300,y=70,labels="Read resource")

lines(x=c(0,5400),y=c(colMeans(mydata[2]),colMeans(mydata[2])),type="l",col="red",lwd=3)
lines(x=c(0,5400),y=c(colMeans(mydata[3]),colMeans(mydata[3])),type="l",col="green",lwd=3)

legend(y=80,x=3100, c(colnames(mydata[,-1]),"Mean (Modem Sleep)","Mean (Light sleep)"),col=c("black","blue","red","green"),cex=0.8,fill=c("black","blue","red","green"))
dev.off()
