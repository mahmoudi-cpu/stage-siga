package tn.esprit.pi.services;

import tn.esprit.pi.entities.DataPoint;

import java.util.List;

public interface Initialiser {
    List<DataPoint> createInitialCentroids(int k, List<DataPoint> points);
}
