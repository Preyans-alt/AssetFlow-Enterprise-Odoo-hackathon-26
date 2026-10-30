Let the size of congestion window of a TCP connection be 32 KB when a timeout occurs. The round trip time of the connection is 100 msec and the maximum
segment size used is 2 KB. The time taken (in msec) by the TCP connection to get back to 32 KB congestion window is
.
A 2 1100 to 1300 800 to 1000 1400 to 1600 None of the mentioned
324 8
On a TCP connection, current congestion window size is Congestion Window = 4 KB. The window size advertised by the receiver is Advertise Window = 6 KB. The
last byte sent by the sender is LastByteSent = 10240 and the last byte
acknowledged by the receiver is LastByteAcked = 8192. The current window size
at the sender is
B 2 2048 bytes 4096 bytes 6144 bytes None of the mentioned
325 8
Assume that the bandwidth for a TCP connection is 1048560 bits/sec. Let 'a' be the value of RTT in milliseconds (round off to nearest integer) after which the TCP window scale option is needed. Let 'b' be the maximum possible window size with window scale option. Then the values of 'a' and 'b' are
C 2
63 ms, 65535 x
2^14
63 ms, 65535 x
2^16
500 ms, 65535 x
2^14 None of the mentioned
326 8 The main difference between TCP and UDP is A 1
UDP is a datagram
where as TCP is a
connection oriented
service
UDP is connection
oriented where as TCP is datagram
service
TCP is an Internet protocol where as UDP is an ATM
protocol
TCP and UDP both
are connectionless
service protocol
327 8 End-to-end connectivity is provided from host-to-host in: D 1 Session layer Network layer Data link layer Transport layer 328 8 Security based connection is provided by which layer? A 1 Transport layer Application layer Network layer Session layer 329 8 In transport layer, message is divided into transmittable A 1 Segments Packets Frames Data
330 8 Which of the following statement is incorrect? C 1
The data link layer handles the transfer of data between the
ends of a physical
link
The presentation
layer transforms
information from
machine format to
the understandable
format
The transport layer provides for any
format, translationer code conversion
necessary to put the data into an
intelligible format
All of the above
331 8
In TCP, an ACK segment, if carrying no data, consumes Sequence number(s). A 1 no one two three
332 8 TCP and UDP are called C 1 Application Protocals Session Protocals Transport Protocals Network Protocals
333 8
In TCP, SYN segment consumes Sequence number(s). B 1 no one two three
334 8
A client that wishes to connect to an open server tells its TCP that it needs to be
connected to that particular server. The process is called
A 1 Active open Active close Passive close Passive open
335 8 Transmission Control Protocol (TCP), needs buffers for A 1 Storage Request Connections Transmission
336 8 UDP packets have a fixed-size header of
bytes. B 1 16 8 40 32
337 8 The Source port number on the UDP user datagram header defines C 1 The sender computer The receiver computer
The process running
on the sending
computer
The process running
on receiving
computer
338 8 Transmission Control Protocol (TCP), A connection- oriented transport protocol establishes a B 1 Virtual
Communication Virtual Path Virtual Flow Virtual Flow
339 8
In User Datagram Protocol (UDP), the user datagrams are not C 1 Channeled Transformed Numbered Addressed
340 8 Beyond IP, UDP provides additional services such as D 1 Routing and
switching
Sending and
receiving of packets Multiplexing and
demultiplexing Demultiplexing and
error checking
341 8 “Total length” field in UDP packet header is the length of D 1 Only UDP header Only data Only checksum
UDP header plus data
342 8
Suppose a TCP connection is transferring a file of 1000 bytes. The first byte is numbered 10001. What is the sequence number of the segment if all data is sent in
only one segment? B 1 10000 10001 12001 11001
343 8 Connection establishment in TCP is done by which mechanism? B 1 Flow control Three-Way Handshaking Forwarding Synchronization
344 8 What allows TCP to detect lost segments and in turn recover from that loss? D 1 Sequence number Acknowledgmen t number Checksum
Both Sequence &
Acknowledgment number
345 8 Beyond IP, UDP provides additional services such as D 1 Routing and
switching
Sending and
receiving of packets Multiplexing and
demultiplexing Demultiplexing and
error checking
Unit-8 Transport Layer Protocols L.J Institute of Engineering and Technology, Ahmedabad. CN Practice book (SEM-V-2025 CE,IT,CSD,AIML,AIDS,CS&IT,CSE,CST,CEA,RAI Engineering)
Sr No Unit Number Question_Text MCQ
Answer Marks Option A Option B Option C Option D
Note : This Practic book is only for reference purpose. LJU Test question paper may not be completely set from this practice book.
346 8 The port number is “ephemeral port number”, if the source host is D 1 NTP Echo Server Client
347 8 UDP is protocol. A 1 Transport Layer Connectionless
Session Layer Connectionless
Transport Layer Connection Oriented
Session Layer Connection Oriented
348 8
Consider the following statements regarding the OSI model: (1) Application Layer provides the control structure for communication between applications; establishes
, manages and terminates connection between cooperating applications. (2) Datalink Layer provides for the reliable transfer of information across the physical
link. (3) Transport Layer provides end-to-end error recovery and flow control of
data. Which of the above statements are correct?
D 2 1 and 2 only 1 and 3 only 1, 2 and 3 only 2 and 3 only
349 8
Consider a long-lived TCP session with an end-to-end bandwidth of 1 Gbps. The
session starts with a sequence number of 1234. The minimum time before this
sequence number can be used again B 1 30-32 34 - 35 20-23 40-45
350 8 The transport layer protocols use for real time multimedia, file transfer are C 1 UDP, UDP TCP, TCP UDP, TCP TCP, UDP
351 8 The transport layer protocols use for DNS and email respectively are C 1 UDP, UDP TCP, TCP UDP, TCP TCP, UDP
352 8
Consider the following statements regarding the slow start phase of the TCP
congestion control algorithm. Note that cwnd stands for the TCP congestion wiindow and MSS denotes the maximum segment size. (i) The cwnd increases by 2 MSS on every successful acknowledgement
(ii) The cwnd increases doubles on every successful acknowledgement (iii) The
cwnd increases by 1 MSS on every round trip time (iv) The cwnd approximately
doubles on every round trip time. Which one of following is correct?
C 2 Only (ii) and (iii) are true Only (i) and (iii) are
true Only (iv) is true Only (i) and (iv) are
true
353 8
What is the value of the receiver window (rwnd) for host A if the receiver, host B, has a buffer size of 7000 bytes and
1000 bytes of received and unprocessed data in bytes?
C 1 1000 7000 6000 2000
354 8 What is the size ofthe window in bytes for host A ifthe value ofrwnd is 3000 bytes and the value of cwnd is 5500 bytes? D 1 1000 7000 6000 3000
355 8
The following is a dump of a UDP header in hexadecimal format. CB84002C 001C0AEC
What is the destination port number? D 2 43 32 42 44
356 8
The following is a dump of a UDP header in hexadecimal format. DB84002C001E0A1C
What is the length of the data? C 2 19 18 22 20
357 8 Compare connectionless services and connection oriented
services. 4
358 8 Explain factors measuring the network traffic performance. 3
359 8
Let the size of congestion window of a TCP connection be 32KB when a timeout occurs. The round trip time of the connection is 100 msec and the maximum
segment size used is 2KB. The time taken (in msec) by the TCP connection to get back to 32KB congestion window is
.
1100- 1300
5
360 8 How TCP protocol provides reliability? 3
361 8 Explain the error control mechanism in TCP? 4
362 8 List the services of end to end services. 3
363 8 What are the advantages of using UDP over TCP? 4
364 8 Which protocol uses both TCP and UDP? and How? 3
365 8
What is the value of the receiver window (rwnd) for host A if the receiver, host B, has a buffer size of 6000 bytes and
1000 bytes of received and unprocessed data?
5000 3
366 8
What is the value of the receiver window (rwnd) for host A if the receiver, host B, has a buffer size of 5000 bytes and
1000 bytes of received and unprocessed data?
4000 3
367 8 What is the size ofthe window for host A ifthe value ofrwnd is 3000 bytes and the value of cwnd is 4500 bytes?
3000
bytes 3
368 8 What is the size ofthe window for host A ifthe value ofrwnd is 4000 bytes and the value of cwnd is 4500 bytes?
4000
bytes 3
369 8 What is the size ofthe window for host A ifthe value ofrwnd is 3000 bytes and the value of cwnd is 3500 bytes?
3000
bytes 3
370 8 Flow Control versus Congestion control 4
371 8
The following is a dump of a UDP header in hexadecimal format. AA84000D001A001A
i. What is the source port number?
ii. What is the destination port number?
iii. What is the total length of the user datagram?
iv. What is the length of the data?
4
372 8
The following is a dump of a UDP header in hexadecimal format. ABAB000D001C001C
i. What is the source port number?
ii. What is the destination port number?
iii. What is the total length of the user datagram?
iv. What is the length of the data?
4
373 8
The following is a dump of a UDP header in hexadecimal format. CCDD000D001C001C
i. What is the source port number?
ii. What is the destination port number?
iii. What is the total length of the user datagram?
iv. What is the length of the data?
4
374 8
The following is a dump of a UDP header in hexadecimal format. CB84000D001C001C
i. What is the source port number?
ii. What is the destination port number?
iii. What is the total length of the user datagram?
iv. What is the length of the data?
3
375 8 Explain the TCP Segment structure and justify the
importance of its field values. 7
376 8 What are various reliable data transfer mechanisms and for what purpose are they used? 4
377 8 How many packets overhead while doing the data communication using TCP? Draw the TCP connection establishment and termination process with diagram
7
378 8 Explain how ip address will get by host A if it wants to connect with