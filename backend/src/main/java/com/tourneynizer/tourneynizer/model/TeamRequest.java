package com.tourneynizer.tourneynizer.model;

import java.sql.Timestamp;

public class TeamRequest {
    private long id, teamId, userId, requesterId;
    private Boolean accepted;
    private Timestamp timeRequested;

    public TeamRequest(long id, long teamId, long userId, long requesterId, Boolean accepted, Timestamp timeRequested) {
        this.id = id;
        this.teamId = teamId;
        this.userId = userId;
        this.requesterId = requesterId;
        this.accepted = accepted;
        this.timeRequested = timeRequested;
    }

    public long getId() {
        return id;
    }

    public long getTeamId() {
        return teamId;
    }

    public long getUserId() {
        return userId;
    }

    public long getRequesterId() {
        return requesterId;
    }

    public Boolean isAccepted() {
        return accepted;
    }

    public Timestamp getTimeRequested() {
        return timeRequested;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TeamRequest that = (TeamRequest) o;

        if (id != that.id) return false;
        if (teamId != that.teamId) return false;
        if (userId != that.userId) return false;
        if (requesterId != that.requesterId) return false;
        if (accepted != null ? !accepted.equals(that.accepted) : that.accepted != null) return false;
        return timeRequested.equals(that.timeRequested);
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
}
