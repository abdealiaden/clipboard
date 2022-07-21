# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

Assumptions
1. Not all facilities would want to give their own agent id. Also, initially when we roll out this feature, information about the custom agent id will not be populated, so in case, if custom agent id is not available, we fall back to internal id for the agent.
2. Response for agent in `getShiftsByFacility` is represented by a list of
class Shift{
    Date start;
    Date end;
    int workingHours;
    AgentMetadata agentMetadata;
}
class AgentMetadata {
    String name;
    String id;
}

3. We are using MySQL to store the data
4. `generateReport` function is in a different service which is a consumer of some queue service. The information from the `getShiftsByFacility` is pushed into the queue. There are several advantages to this approach. Some of which is, 1. creating a PDF and sending an email to the client can be asynchronous. 2. We can scale the number of consumers independently, as and when we need to produce more reports. For example, ss these are qaurterly reports, the number of requests during the end of the quarter can be much higher than the normal days. This consumer service does not directly communicate with database.

Approach
The relationship between facilities and agents is many to many. To store this relationship with additional data (the id provided by the faclities), one more table will be created `FacilityAgent`. AgentMetadata will be modified to include the id provided by the facility. `getShiftsByFacility` will be modified to include the provided id and `generateReport` will be modified to use this provided id if it is not null.

Ticket 1
Create `FacilityAgent` table
New table had to be created on our database
CREATE TABLE FacilityAgent(
    facilityId BIGINT NOT NULL,
    agentId BIGINT NOT NULL,
    providedId VARCHAR(255) NOT NULL,
    PRIMARY KEY (facilityId, agentId),
    FOREIGN KEY agentId REFERENCES agent(id).
    FOREIGN KEY facilityId REFERENCES facility(id).
)

Having combination of (facilityId, agentId) serves 2 purpose. 
1. It creates composite index for these 2 columns. As queries to get the providedId will include both of this fields in WHERE query, search will be optimized.
2. It adds a unique constraint, so that a facility can't add multiple providedId for the agent.

Effort - (2 hours) (0.25 Story Points)

Ticket 2 
Modify AgentMetadata to 
class AgentMetadata{
    String name;
    String id;
    String providedId;
}
Populate providedId from `FacilityAgent` table for the required facility and agent for `getShiftsByFacility` function if it is available. 
If `getShiftsByFacility` is only consumed for generating reports, then instead of populating internal id to the id field, we can populate providedId in the id field. This way, there is no need to modify `generateReport`. 
But we are assuming that `getShiftsByFacility` is used from other places as well
This function should work even when there is no providedId for the agent i.e. if facility has not provided any id to the agent.

Effort - 1 day (1 Story Point)

Ticket 3
Modify `generateReport` to consume providedId in AgentMetadata
This will be a small change, where instead of populating id in the PDF, we will be populating providedId from AgentMetadata if it is available. Otherwise, we will fallback to the internal id.

Effort - 2 hours (0.25 Story Points)

Ticket 4
QA for supporting custom id for agent from Facilities
The test cases should cover these corner cases.
1. Generating reports for agents who does not have providedId.
2. Generating reports for agents for which some of the agents have providedId.
3. Adding multiple providedIds for the same agent for the same facility. (This should not happen).
4. Adding multiple providedIds for the same agent but from different facilities and generating report for them








